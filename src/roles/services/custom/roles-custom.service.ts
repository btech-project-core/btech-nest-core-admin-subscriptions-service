import { Injectable } from '@nestjs/common';
import { Role } from '../../entities/role.entity';
import { RolesFindOneByCodeService } from './roles-find-one-by-code.service';
import { RolesRelatedSubscribersService } from './roles-related-subscribers.service';

@Injectable()
export class RolesCustomService {
  constructor(
    private readonly rolesFindOneByCodeService: RolesFindOneByCodeService,
    private readonly rolesRelatedSubscribersService: RolesRelatedSubscribersService,
  ) {}

  async findOneByCode(
    code: string,
    subscriptionDetailId?: string,
    subscriptionBussineId?: string,
  ): Promise<Role> {
    return await this.rolesFindOneByCodeService.execute(
      code,
      subscriptionDetailId,
      subscriptionBussineId,
    );
  }

  async relatedSubscribers(roleId: string): Promise<void> {
    return await this.rolesRelatedSubscribersService.execute(roleId);
  }
}
