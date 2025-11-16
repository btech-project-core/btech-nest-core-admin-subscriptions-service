export * from './subscribers-core.controller';
export * from './subscribers-custom.controller';
export * from './subscribers-validation.controller';
export * from './subscribers-bulk.controller';

import { SubscribersCoreController } from './subscribers-core.controller';
import { SubscribersCustomController } from './subscribers-custom.controller';
import { SubscribersValidationController } from './subscribers-validation.controller';
import { SubscribersBulkController } from './subscribers-bulk.controller';

export const SUBSCRIBERS_CONTROLLERS = [
  SubscribersCoreController,
  SubscribersCustomController,
  SubscribersValidationController,
  SubscribersBulkController,
];
