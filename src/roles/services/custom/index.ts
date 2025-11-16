export * from './roles-find-one-by-code.service';
export * from './roles-related-subscribers.service';
export * from './roles-custom.service';
export * from './role-subscription-detail-find-by-role-and-service.service';
export * from './role-subscription-detail-custom.service';

import { RolesFindOneByCodeService } from './roles-find-one-by-code.service';
import { RolesRelatedSubscribersService } from './roles-related-subscribers.service';
import { RolesCustomService } from './roles-custom.service';
import { RoleSubscriptionDetailFindByRoleAndServiceService } from './role-subscription-detail-find-by-role-and-service.service';
import { RoleSubscriptionDetailCustomService } from './role-subscription-detail-custom.service';

export const ROLES_CUSTOM_SERVICES = [
  RolesFindOneByCodeService,
  RolesRelatedSubscribersService,
  RolesCustomService,
  RoleSubscriptionDetailFindByRoleAndServiceService,
  RoleSubscriptionDetailCustomService,
];
