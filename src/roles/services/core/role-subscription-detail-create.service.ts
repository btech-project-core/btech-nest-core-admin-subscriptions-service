import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleSubscriptionDetail } from '../../entities/role-subscription-detail.entity';
import { Role } from '../../entities/role.entity';
import { SubscriptionDetail } from 'src/subscriptions-detail/entities/subscription-detail.entity';

@Injectable()
export class RoleSubscriptionDetailCreateService {
  constructor(
    @InjectRepository(RoleSubscriptionDetail)
    private readonly roleSubscriptionDetailRepository: Repository<RoleSubscriptionDetail>,
  ) {}

  async execute(
    role: Role,
    subscriptionDetail: SubscriptionDetail,
    isActive: boolean = true,
  ): Promise<RoleSubscriptionDetail> {
    const roleSubscriptionDetail = this.roleSubscriptionDetailRepository.create(
      {
        role,
        subscriptionDetail,
        isActive,
      },
    );
    return await this.roleSubscriptionDetailRepository.save(
      roleSubscriptionDetail,
    );
  }
}
