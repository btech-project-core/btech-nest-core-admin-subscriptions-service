import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { RoleLevel } from 'src/roles/enums/role-level.enum';
import { RoleSubscriptionDetailValidationService } from 'src/roles/services/validation/role-subscription-detail-validation.service';
import { SubscriberRole } from 'src/subscribers/entities';
import { SubscribersSubscriptionDetail } from 'src/subscribers-subscription-detail/entities/subscribers-subscription-detail.entity';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class SubscriberRoleCoreService {
  constructor(
    @InjectRepository(SubscriberRole)
    private readonly subscriberRoleRepository: Repository<SubscriberRole>,
    private readonly roleSubscriptionDetailValidationService: RoleSubscriptionDetailValidationService,
  ) {}

  async create(
    subscribersSubscriptionDetail: SubscribersSubscriptionDetail,
    role: Role,
    isActive: boolean = true,
  ): Promise<SubscriberRole> {
    // Validar si el rol requiere asociación con el servicio
    if (role.roleLevel === RoleLevel.SERVICE) {
      const isValidForService =
        await this.roleSubscriptionDetailValidationService.validateRoleForService(
          role.roleId,
          subscribersSubscriptionDetail.subscriptionDetail.subscriptionDetailId,
        );
      if (!isValidForService)
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: `El rol '${role.description}' con nivel SERVICE no está habilitado para este servicio. Debe configurar la relación rol-servicio primero.`,
        });
    }
    const subscriberRole = this.subscriberRoleRepository.create({
      subscribersSubscriptionDetail,
      role,
      isActive,
    });
    return await this.subscriberRoleRepository.save(subscriberRole);
  }
}
