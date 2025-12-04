export * from './subscribers-subscription-detail-core.controller';
export * from './subscribers-subscription-detail-custom.controller';

import { SubscribersSubscriptionDetailCoreController } from './subscribers-subscription-detail-core.controller';
import { SubscribersSubscriptionDetailCustomController } from './subscribers-subscription-detail-custom.controller';

export const SUBSCRIBERS_SUBSCRIPTION_DETAIL_CONTROLLERS = [
  SubscribersSubscriptionDetailCoreController,
  SubscribersSubscriptionDetailCustomController,
];
