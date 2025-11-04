import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { SubscriberRole } from '../entities/subscriber-role.entity';
import { SubscribersSubscriptionDetail } from '../../subscribers-subscription-detail/entities/subscribers-subscription-detail.entity';
import { Role } from '../../roles/entities/role.entity';
import { RoleLevel } from 'src/roles/enums/role-level.enum';
import { RoleSubscriptionDetailValidateService } from 'src/roles/services/role-subscription-detail-validate.service';

@Injectable()
export class SubscriberRoleCoreService {
  constructor(
    @InjectRepository(SubscriberRole)
    private readonly subscriberRoleRepository: Repository<SubscriberRole>,
    private readonly roleSubscriptionDetailValidateService: RoleSubscriptionDetailValidateService,
  ) {}

  async create(
    subscribersSubscriptionDetail: SubscribersSubscriptionDetail,
    role: Role,
    isActive: boolean = true,
  ): Promise<SubscriberRole> {
    // Validar si el rol requiere asociación con el servicio
    if (role.roleLevel === RoleLevel.SERVICE) {
      const isValidForService =
        await this.roleSubscriptionDetailValidateService.validateRoleForService(
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
