export * from './subscription-detail-create.service';
export * from './subscription-detail-core.service';
export * from './subscription-detail-find-all.service';

import { SubscriptionDetailCreateService } from './subscription-detail-create.service';
import { SubscriptionDetailCoreService } from './subscription-detail-core.service';
import { SubscriptionDetailFindAllService } from './subscription-detail-find-all.service';

export const SUBSCRIPTIONS_DETAIL_CORE_SERVICES = [
  SubscriptionDetailCreateService,
  SubscriptionDetailCoreService,
  SubscriptionDetailFindAllService,
];
