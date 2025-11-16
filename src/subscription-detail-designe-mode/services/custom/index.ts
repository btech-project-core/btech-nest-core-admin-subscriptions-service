export * from './subscription-detail-designe-mode-find-by-domain.service';
export * from './subscription-detail-designe-mode-custom.service';

import { SubscriptionDetailDesigneModeFindByDomainService } from './subscription-detail-designe-mode-find-by-domain.service';
import { SubscriptionDetailDesigneModeCustomService } from './subscription-detail-designe-mode-custom.service';

export const SUBSCRIPTION_DETAIL_DESIGNE_MODE_CUSTOM_SERVICES = [
  SubscriptionDetailDesigneModeFindByDomainService,
  SubscriptionDetailDesigneModeCustomService,
];
