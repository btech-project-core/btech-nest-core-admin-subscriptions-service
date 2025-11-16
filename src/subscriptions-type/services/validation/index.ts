export * from './subscriptions-type-is-valid.service';
export * from './subscriptions-type-validation.service';

import { SubscriptionsTypeIsValidService } from './subscriptions-type-is-valid.service';
import { SubscriptionsTypeValidationService } from './subscriptions-type-validation.service';

export const SUBSCRIPTIONS_TYPE_VALIDATION_SERVICES = [
  SubscriptionsTypeIsValidService,
  SubscriptionsTypeValidationService,
];
