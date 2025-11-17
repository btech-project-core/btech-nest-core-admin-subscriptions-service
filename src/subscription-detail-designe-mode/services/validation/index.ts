export * from './subscription-detail-designe-mode-validate-only-one-primary.service';
export * from './subscription-detail-designe-mode-validate-unique-mode-combination.service';
export * from './subscription-detail-designe-mode-validate-default-requirements.service';
export * from './subscription-detail-designe-mode-validation.service';

import { SubscriptionDetailDesigneModeValidateOnlyOnePrimaryService } from './subscription-detail-designe-mode-validate-only-one-primary.service';
import { SubscriptionDetailDesigneModeValidateUniqueModeCombinationService } from './subscription-detail-designe-mode-validate-unique-mode-combination.service';
import { SubscriptionDetailDesigneModeValidateSystemDefaultRequirementsService } from './subscription-detail-designe-mode-validate-default-requirements.service';
import { SubscriptionDetailDesigneModeValidationService } from './subscription-detail-designe-mode-validation.service';

export const SUBSCRIPTION_DETAIL_DESIGNE_MODE_VALIDATION_SERVICES = [
  SubscriptionDetailDesigneModeValidateOnlyOnePrimaryService,
  SubscriptionDetailDesigneModeValidateUniqueModeCombinationService,
  SubscriptionDetailDesigneModeValidateSystemDefaultRequirementsService,
  SubscriptionDetailDesigneModeValidationService,
];
