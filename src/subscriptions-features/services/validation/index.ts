export * from './subscriptions-features-is-valid.service';
export * from './subscriptions-features-validation.service';

import { SubscriptionsFeaturesIsValidService } from './subscriptions-features-is-valid.service';
import { SubscriptionsFeaturesValidationService } from './subscriptions-features-validation.service';

export const SUBSCRIPTIONS_FEATURES_VALIDATION_SERVICES = [
  SubscriptionsFeaturesIsValidService,
  SubscriptionsFeaturesValidationService,
];
