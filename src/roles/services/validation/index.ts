export * from './roles-is-valid.service';
export * from './roles-validation.service';
export * from './role-subscription-detail-validate-role-for-service.service';
export * from './role-subscription-detail-validation.service';

import { RolesIsValidService } from './roles-is-valid.service';
import { RolesValidationService } from './roles-validation.service';
import { RoleSubscriptionDetailValidateRoleForServiceService } from './role-subscription-detail-validate-role-for-service.service';
import { RoleSubscriptionDetailValidationService } from './role-subscription-detail-validation.service';

export const ROLES_VALIDATION_SERVICES = [
  RolesIsValidService,
  RolesValidationService,
  RoleSubscriptionDetailValidateRoleForServiceService,
  RoleSubscriptionDetailValidationService,
];
