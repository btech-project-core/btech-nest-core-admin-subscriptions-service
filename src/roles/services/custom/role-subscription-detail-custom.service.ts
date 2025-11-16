import { Injectable } from '@nestjs/common';
import { RoleSubscriptionDetail } from '../../entities/role-subscription-detail.entity';
import { RoleSubscriptionDetailFindByRoleAndServiceService } from './role-subscription-detail-find-by-role-and-service.service';

@Injectable()
export class RoleSubscriptionDetailCustomService {
  constructor(
    private readonly roleSubscriptionDetailFindByRoleAndServiceService: RoleSubscriptionDetailFindByRoleAndServiceService,
  ) {}

  async findByRoleAndService(
    roleId: string,
    subscriptionDetailId: string,
  ): Promise<RoleSubscriptionDetail | null> {
    return await this.roleSubscriptionDetailFindByRoleAndServiceService.execute(
      roleId,
      subscriptionDetailId,
    );
  }
}
