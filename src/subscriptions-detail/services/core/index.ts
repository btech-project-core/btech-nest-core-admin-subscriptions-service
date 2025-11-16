export * from './subscription-detail-create.service';
export * from './subscription-detail-core.service';

import { SubscriptionDetailCreateService } from './subscription-detail-create.service';
import { SubscriptionDetailCoreService } from './subscription-detail-core.service';

export const SUBSCRIPTIONS_DETAIL_CORE_SERVICES = [
  SubscriptionDetailCreateService,
  SubscriptionDetailCoreService,
];
