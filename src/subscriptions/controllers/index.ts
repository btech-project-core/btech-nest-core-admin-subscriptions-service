export * from './subscriptions-core.controller';
export * from './subscriptions-validation.controller';
export * from './subscriptions-document.controller';

import { SubscriptionsCoreController } from './subscriptions-core.controller';
import { SubscriptionsValidationController } from './subscriptions-validation.controller';
import { SubscriptionsDocumentController } from './subscriptions-document.controller';

export const SUBSCRIPTIONS_CONTROLLERS = [
  SubscriptionsCoreController,
  SubscriptionsValidationController,
  SubscriptionsDocumentController,
];
