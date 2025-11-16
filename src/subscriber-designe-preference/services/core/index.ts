export * from './subscriber-designe-preference-core.service';
export * from './subscriber-designe-preference-create-or-update.service';

import { SubscriberDesignePreferenceCoreService } from './subscriber-designe-preference-core.service';
import { SubscriberDesignePreferenceCreateOrUpdateService } from './subscriber-designe-preference-create-or-update.service';

export const SUBSCRIBER_DESIGNE_PREFERENCE_CORE_SERVICES = [
  SubscriberDesignePreferenceCoreService,
  SubscriberDesignePreferenceCreateOrUpdateService,
];
