export * from './subscriptions-core.controller';
export * from './subscriptions-custom.controller';
export * from './subscriptions-validation.controller';

import { SubscriptionsCoreController } from './subscriptions-core.controller';
import { SubscriptionsCustomController } from './subscriptions-custom.controller';
import { SubscriptionsValidationController } from './subscriptions-validation.controller';

export const SUBSCRIPTIONS_CONTROLLERS = [
  SubscriptionsCoreController,
  SubscriptionsCustomController,
  SubscriptionsValidationController,
];
