export * from './subscriptions-type-core.service';
export * from './subscriptions-type-create.service';
export * from './subscriptions-type-find-all.service';
export * from './subscriptions-type-find-one.service';
export * from './subscriptions-type-update.service';
export * from './subscriptions-type-update-status.service';

import { SubscriptionsTypeCoreService } from './subscriptions-type-core.service';
import { SubscriptionsTypeCreateService } from './subscriptions-type-create.service';
import { SubscriptionsTypeFindAllService } from './subscriptions-type-find-all.service';
import { SubscriptionsTypeFindOneService } from './subscriptions-type-find-one.service';
import { SubscriptionsTypeUpdateService } from './subscriptions-type-update.service';
import { SubscriptionsTypeUpdateStatusService } from './subscriptions-type-update-status.service';

export const SUBSCRIPTIONS_TYPE_CORE_SERVICES = [
  SubscriptionsTypeCoreService,
  SubscriptionsTypeCreateService,
  SubscriptionsTypeFindAllService,
  SubscriptionsTypeFindOneService,
  SubscriptionsTypeUpdateService,
  SubscriptionsTypeUpdateStatusService,
];
