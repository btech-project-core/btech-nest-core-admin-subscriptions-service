export * from './subscriptions-type-related-subscriptions.service';
export * from './subscriptions-type-custom.service';

import { SubscriptionsTypeRelatedSubscriptionsService } from './subscriptions-type-related-subscriptions.service';
import { SubscriptionsTypeCustomService } from './subscriptions-type-custom.service';

export const SUBSCRIPTIONS_TYPE_CUSTOM_SERVICES = [
  SubscriptionsTypeRelatedSubscriptionsService,
  SubscriptionsTypeCustomService,
];
