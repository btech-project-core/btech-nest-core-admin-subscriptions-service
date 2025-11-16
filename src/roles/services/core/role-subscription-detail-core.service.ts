import { Injectable } from '@nestjs/common';
import { RoleSubscriptionDetail } from '../../entities/role-subscription-detail.entity';
import { Role } from '../../entities/role.entity';
import { SubscriptionDetail } from 'src/subscriptions-detail/entities/subscription-detail.entity';
import { RoleSubscriptionDetailCreateService } from './role-subscription-detail-create.service';

@Injectable()
export class RoleSubscriptionDetailCoreService {
  constructor(
    private readonly roleSubscriptionDetailCreateService: RoleSubscriptionDetailCreateService,
  ) {}

  async create(
    role: Role,
    subscriptionDetail: SubscriptionDetail,
    isActive: boolean = true,
  ): Promise<RoleSubscriptionDetail> {
    return await this.roleSubscriptionDetailCreateService.execute(
      role,
      subscriptionDetail,
      isActive,
    );
  }
}
