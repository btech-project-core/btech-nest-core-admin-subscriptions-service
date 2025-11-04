import { Module } from '@nestjs/common';
import { RolesService } from './services/roles.service';
import { RolesCoreService } from './services/roles-core.service';
import { RolesValidateService } from './services/roles-validate.service';
import { RolesCustomService } from './services/roles-custom.service';
import { RoleSubscriptionDetailCoreService } from './services/role-subscription-detail-core.service';
import { RoleSubscriptionDetailValidateService } from './services/role-subscription-detail-validate.service';
import { RoleSubscriptionDetailCustomService } from './services/role-subscription-detail-custom.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleSubscriptionDetail } from './entities/role-subscription-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, RoleSubscriptionDetail])],
  controllers: [RolesController],
  providers: [
    RolesService,
    RolesCoreService,
    RolesValidateService,
    RolesCustomService,
    RoleSubscriptionDetailCoreService,
    RoleSubscriptionDetailValidateService,
    RoleSubscriptionDetailCustomService,
  ],
  exports: [
    RolesService,
    RolesValidateService,
    RolesCustomService,
    RoleSubscriptionDetailCoreService,
    RoleSubscriptionDetailValidateService,
    RoleSubscriptionDetailCustomService,
  ],
})
export class RolesModule {}
