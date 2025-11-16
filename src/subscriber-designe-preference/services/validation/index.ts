export * from './subscriber-designe-preference-validate-subscription-detail-designe-mode.service';
export * from './subscriber-designe-preference-validate-details.service';
export * from './subscriber-designe-preference-validate-design.service';
export * from './subscriber-designe-preference-validation.service';

import { SubscriberDesignePreferenceValidateSubscriptionDetailDesigneModeService } from './subscriber-designe-preference-validate-subscription-detail-designe-mode.service';
import { SubscriberDesignePreferenceValidateDetailsService } from './subscriber-designe-preference-validate-details.service';
import { SubscriberDesignePreferenceValidateDesignService } from './subscriber-designe-preference-validate-design.service';
import { SubscriberDesignePreferenceValidationService } from './subscriber-designe-preference-validation.service';

export const SUBSCRIBER_DESIGNE_PREFERENCE_VALIDATION_SERVICES = [
  SubscriberDesignePreferenceValidateSubscriptionDetailDesigneModeService,
  SubscriberDesignePreferenceValidateDetailsService,
  SubscriberDesignePreferenceValidateDesignService,
  SubscriberDesignePreferenceValidationService,
];
