export * from './subscribers-subscription-detail-assign-to-service.service';
export * from './subscribers-subscription-detail-custom.service';

import { SubscribersSubscriptionDetailAssignToServiceService } from './subscribers-subscription-detail-assign-to-service.service';
import { SubscribersSubscriptionDetailCustomService } from './subscribers-subscription-detail-custom.service';

export const subscribersSubscriptionDetailCustomProviders = [
  SubscribersSubscriptionDetailAssignToServiceService,
  SubscribersSubscriptionDetailCustomService,
];
