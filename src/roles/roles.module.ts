import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleSubscriptionDetail } from './entities/role-subscription-detail.entity';
import { ROLES_CONTROLLERS } from './controllers';
import { ROLES_CORE_SERVICES } from './services/core';
import { ROLES_CUSTOM_SERVICES } from './services/custom';
import { ROLES_VALIDATION_SERVICES } from './services/validation';

@Module({
  imports: [TypeOrmModule.forFeature([Role, RoleSubscriptionDetail])],
  controllers: [...ROLES_CONTROLLERS],
  providers: [
    ...ROLES_CORE_SERVICES,
    ...ROLES_CUSTOM_SERVICES,
    ...ROLES_VALIDATION_SERVICES,
  ],
  exports: [
    ...ROLES_CORE_SERVICES,
    ...ROLES_CUSTOM_SERVICES,
    ...ROLES_VALIDATION_SERVICES,
  ],
})
export class RolesModule {}
