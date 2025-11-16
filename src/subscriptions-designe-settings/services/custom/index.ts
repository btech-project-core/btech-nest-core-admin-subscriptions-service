export * from './subscriptions-designe-settings-find-by-domain.service';
export * from './subscriptions-designe-settings-custom.service';

import { SubscriptionsDesigneSettingsFindByDomainService } from './subscriptions-designe-settings-find-by-domain.service';
import { SubscriptionsDesigneSettingsCustomService } from './subscriptions-designe-settings-custom.service';

export const SUBSCRIPTIONS_DESIGNE_SETTINGS_CUSTOM_SERVICES = [
  SubscriptionsDesigneSettingsFindByDomainService,
  SubscriptionsDesigneSettingsCustomService,
];
