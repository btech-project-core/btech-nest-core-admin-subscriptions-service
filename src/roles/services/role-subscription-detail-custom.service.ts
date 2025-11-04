import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleSubscriptionDetail } from '../entities/role-subscription-detail.entity';

@Injectable()
export class RoleSubscriptionDetailCustomService {
  constructor(
    @InjectRepository(RoleSubscriptionDetail)
    private readonly roleSubscriptionDetailRepository: Repository<RoleSubscriptionDetail>,
  ) {}

  async findByRoleAndService(
    roleId: string,
    subscriptionDetailId: string,
  ): Promise<RoleSubscriptionDetail | null> {
    return await this.roleSubscriptionDetailRepository.findOne({
      where: {
        role: { roleId },
        subscriptionDetail: { subscriptionDetailId },
        isActive: true,
      },
      relations: ['role', 'subscriptionDetail'],
    });
  }
}
