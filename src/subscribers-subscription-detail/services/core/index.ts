export * from './subscribers-subscription-detail-core.service';
export * from './subscribers-subscription-detail-create.service';

import { SubscribersSubscriptionDetailCoreService } from './subscribers-subscription-detail-core.service';
import { SubscribersSubscriptionDetailCreateService } from './subscribers-subscription-detail-create.service';

export const SUBSCRIBERS_SUBSCRIPTION_DETAIL_CORE_SERVICES = [
  SubscribersSubscriptionDetailCoreService,
  SubscribersSubscriptionDetailCreateService,
];
