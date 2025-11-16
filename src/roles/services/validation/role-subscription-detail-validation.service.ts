import { Injectable } from '@nestjs/common';
import { RoleSubscriptionDetailValidateRoleForServiceService } from './role-subscription-detail-validate-role-for-service.service';

@Injectable()
export class RoleSubscriptionDetailValidationService {
  constructor(
    private readonly roleSubscriptionDetailValidateRoleForServiceService: RoleSubscriptionDetailValidateRoleForServiceService,
  ) {}

  async validateRoleForService(
    roleId: string,
    subscriptionDetailId: string,
  ): Promise<boolean> {
    return await this.roleSubscriptionDetailValidateRoleForServiceService.execute(
      roleId,
      subscriptionDetailId,
    );
  }
}
