import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { TransactionService } from 'src/common/services';
import { RolesFindOneByCodeService } from 'src/roles/services/custom/roles-find-one-by-code.service';
import { SubscribersFindWithBusinessService } from 'src/subscribers/services/validation/subscribers-find-with-business.service';
import { SubscriptionDetailFindWithBusinessService } from 'src/subscriptions-detail/services/validation/subscription-detail-find-with-business.service';
import { SubscribersSubscriptionDetailCreateService } from '../core/subscribers-subscription-detail-create.service';
import { SubscriberRoleCreateService } from 'src/subscribers/services/core/subscriber-role-create.service';
import { SubscribersSubscriptionDetailCheckExistingAssignmentService } from '../validation/subscribers-subscription-detail-check-existing-assignment.service';
import {
  AssignSubscriberToServiceDto,
  AssignSubscriberToServiceResponseDto,
} from '../../dto/assign-subscriber-to-service.dto';

@Injectable()
export class SubscribersSubscriptionDetailAssignToServiceService {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly subscribersFindWithBusinessService: SubscribersFindWithBusinessService,
    private readonly subscriptionDetailFindWithBusinessService: SubscriptionDetailFindWithBusinessService,
    private readonly subscribersSubscriptionDetailCheckExistingAssignmentService: SubscribersSubscriptionDetailCheckExistingAssignmentService,
    private readonly rolesFindOneByCodeService: RolesFindOneByCodeService,
    private readonly subscribersSubscriptionDetailCreateService: SubscribersSubscriptionDetailCreateService,
    private readonly subscriberRoleCreateService: SubscriberRoleCreateService,
  ) {}

  async execute(
    dto: AssignSubscriberToServiceDto,
  ): Promise<AssignSubscriberToServiceResponseDto> {
    // 1. Validar que el subscriber existe y obtener su información con business
    const subscriber = await this.subscribersFindWithBusinessService.execute(
      dto.subscriberId,
    );
    // 2. Validar que el subscriptionDetail existe y obtener su información con business
    const subscriptionDetail =
      await this.subscriptionDetailFindWithBusinessService.execute(
        dto.subscriptionDetailId,
      );
    // 3. Validar que el subscriptionBussineId coincide
    const subscriberBussineId =
      subscriber.subscriptionsBussine?.subscriptionBussineId;
    const subscriptionDetailBussineId =
      subscriptionDetail.subscriptionsBussine?.subscriptionBussineId;
    if (subscriberBussineId !== subscriptionDetailBussineId)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message:
          'El suscriptor y el detalle de suscripción no pertenecen al mismo negocio',
      });
    // 4. Validar que el rol existe
    const role = await this.rolesFindOneByCodeService.execute(
      dto.roleCode,
      dto.subscriptionDetailId,
      subscriberBussineId,
    );
    // 5. Validar que el usuario no esté previamente asignado al subscriptionDetailId con ese rol
    const existingAssignment =
      await this.subscribersSubscriptionDetailCheckExistingAssignmentService.execute(
        dto.subscriberId,
        dto.subscriptionDetailId,
        dto.roleCode,
      );
    // 6. Usar transacciones para crear los registros
    return await this.transactionService.runInTransaction(
      async (queryRunner) => {
        let subscribersSubscriptionDetail = existingAssignment;
        // Si no existe la asignación, crearla
        if (!subscribersSubscriptionDetail)
          subscribersSubscriptionDetail =
            await this.subscribersSubscriptionDetailCreateService.execute(
              subscriber,
              subscriptionDetail,
              true,
              queryRunner,
            );
        // Cargar la relación subscriptionDetail si no está cargada
        if (!subscribersSubscriptionDetail.subscriptionDetail)
          subscribersSubscriptionDetail.subscriptionDetail = subscriptionDetail;
        // Crear el rol del subscriber
        const subscriberRole = await this.subscriberRoleCreateService.execute(
          subscribersSubscriptionDetail,
          role,
          true,
          queryRunner,
        );
        return {
          subscribersSubscriptionDetailId:
            subscribersSubscriptionDetail.subscribersSubscriptionDetailId,
          subscriberRoleId: subscriberRole.subscriberRoleId,
          subscriberId: dto.subscriberId,
          subscriptionDetailId: dto.subscriptionDetailId,
          roleCode: dto.roleCode,
          message:
            'Suscriptor asignado al servicio exitosamente con el rol especificado',
        };
      },
    );
  }
}
