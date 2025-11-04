import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleSubscriptionDetail } from '../entities/role-subscription-detail.entity';

@Injectable()
export class RoleSubscriptionDetailValidateService {
  constructor(
    @InjectRepository(RoleSubscriptionDetail)
    private readonly roleSubscriptionDetailRepository: Repository<RoleSubscriptionDetail>,
  ) {}

  async validateRoleForService(
    roleId: string,
    subscriptionDetailId: string,
  ): Promise<boolean> {
    const count = await this.roleSubscriptionDetailRepository.count({
      where: {
        role: { roleId },
        subscriptionDetail: { subscriptionDetailId },
        isActive: true,
      },
    });
    return count > 0;
  }
}
