export * from './subscriptions-services-related.service';
export * from './subscriptions-services-custom.service';

import { SubscriptionsServicesRelatedService } from './subscriptions-services-related.service';
import { SubscriptionsServicesCustomService } from './subscriptions-services-custom.service';

export const SUBSCRIPTIONS_SERVICES_CUSTOM_SERVICES = [
  SubscriptionsServicesRelatedService,
  SubscriptionsServicesCustomService,
];
