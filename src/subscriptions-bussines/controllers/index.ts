export * from './subscriptions-bussines-validation.controller';
export * from './subscriptions-bussines-custom.controller';

import { SubscriptionsBussinesValidationController } from './subscriptions-bussines-validation.controller';
import { SubscriptionsBussinesCustomController } from './subscriptions-bussines-custom.controller';

export const SUBSCRIPTIONS_BUSSINES_CONTROLLERS = [
  SubscriptionsBussinesValidationController,
  SubscriptionsBussinesCustomController,
];
