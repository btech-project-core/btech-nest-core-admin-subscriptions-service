export * from './roles-create.service';
export * from './roles-find-all.service';
export * from './roles-find-one.service';
export * from './roles-update.service';
export * from './roles-update-status.service';
export * from './roles-core.service';
export * from './role-subscription-detail-create.service';
export * from './role-subscription-detail-core.service';

import { RolesCreateService } from './roles-create.service';
import { RolesFindAllService } from './roles-find-all.service';
import { RolesFindOneService } from './roles-find-one.service';
import { RolesUpdateService } from './roles-update.service';
import { RolesUpdateStatusService } from './roles-update-status.service';
import { RolesCoreService } from './roles-core.service';
import { RoleSubscriptionDetailCreateService } from './role-subscription-detail-create.service';
import { RoleSubscriptionDetailCoreService } from './role-subscription-detail-core.service';

export const ROLES_CORE_SERVICES = [
  RolesCreateService,
  RolesFindAllService,
  RolesFindOneService,
  RolesUpdateService,
  RolesUpdateStatusService,
  RolesCoreService,
  RoleSubscriptionDetailCreateService,
  RoleSubscriptionDetailCoreService,
];
