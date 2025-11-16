export * from './subscriptions-features-related.service';
export * from './subscriptions-features-custom.service';

import { SubscriptionsFeaturesRelatedService } from './subscriptions-features-related.service';
import { SubscriptionsFeaturesCustomService } from './subscriptions-features-custom.service';

export const SUBSCRIPTIONS_FEATURES_CUSTOM_SERVICES = [
  SubscriptionsFeaturesRelatedService,
  SubscriptionsFeaturesCustomService,
];
