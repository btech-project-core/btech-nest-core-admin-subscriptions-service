export * from './subscription-detail-designe-mode-core.service';
export * from './subscription-detail-designe-mode-create.service';
export * from './subscription-detail-designe-mode-find-all.service';
export * from './subscription-detail-designe-mode-find-one.service';
export * from './subscription-detail-designe-mode-delete.service';

import { SubscriptionDetailDesigneModeCoreService } from './subscription-detail-designe-mode-core.service';
import { SubscriptionDetailDesigneModeCreateService } from './subscription-detail-designe-mode-create.service';
import { SubscriptionDetailDesigneModeFindAllService } from './subscription-detail-designe-mode-find-all.service';
import { SubscriptionDetailDesigneModeFindOneService } from './subscription-detail-designe-mode-find-one.service';
import { SubscriptionDetailDesigneModeDeleteService } from './subscription-detail-designe-mode-delete.service';

export const SUBSCRIPTION_DETAIL_DESIGNE_MODE_CORE_SERVICES = [
  SubscriptionDetailDesigneModeCoreService,
  SubscriptionDetailDesigneModeCreateService,
  SubscriptionDetailDesigneModeFindAllService,
  SubscriptionDetailDesigneModeFindOneService,
  SubscriptionDetailDesigneModeDeleteService,
];
