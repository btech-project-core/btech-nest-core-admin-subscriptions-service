export * from './subscriptions-detail-custom.controller';
export * from './subscriptions-detail-core.controller';

import { SubscriptionsDetailCustomController } from './subscriptions-detail-custom.controller';
import { SubscriptionsDetailCoreController } from './subscriptions-detail-core.controller';

export const SUBSCRIPTIONS_DETAIL_CONTROLLERS = [
  SubscriptionsDetailCustomController,
  SubscriptionsDetailCoreController,
];
