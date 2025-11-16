export * from './subscriptions-features-core.service';
export * from './subscriptions-features-create.service';
export * from './subscriptions-features-find-all.service';
export * from './subscriptions-features-find-one.service';
export * from './subscriptions-features-update.service';
export * from './subscriptions-features-update-status.service';

import { SubscriptionsFeaturesCoreService } from './subscriptions-features-core.service';
import { SubscriptionsFeaturesCreateService } from './subscriptions-features-create.service';
import { SubscriptionsFeaturesFindAllService } from './subscriptions-features-find-all.service';
import { SubscriptionsFeaturesFindOneService } from './subscriptions-features-find-one.service';
import { SubscriptionsFeaturesUpdateService } from './subscriptions-features-update.service';
import { SubscriptionsFeaturesUpdateStatusService } from './subscriptions-features-update-status.service';

export const SUBSCRIPTIONS_FEATURES_CORE_SERVICES = [
  SubscriptionsFeaturesCoreService,
  SubscriptionsFeaturesCreateService,
  SubscriptionsFeaturesFindAllService,
  SubscriptionsFeaturesFindOneService,
  SubscriptionsFeaturesUpdateService,
  SubscriptionsFeaturesUpdateStatusService,
];
