export * from './subscription-detail-designe-mode-core.controller';
export * from './subscription-detail-designe-mode-custom.controller';

import { SubscriptionDetailDesigneModeCoreController } from './subscription-detail-designe-mode-core.controller';
import { SubscriptionDetailDesigneModeCustomController } from './subscription-detail-designe-mode-custom.controller';

export const SUBSCRIPTION_DETAIL_DESIGNE_MODE_CONTROLLERS = [
  SubscriptionDetailDesigneModeCoreController,
  SubscriptionDetailDesigneModeCustomController,
];
