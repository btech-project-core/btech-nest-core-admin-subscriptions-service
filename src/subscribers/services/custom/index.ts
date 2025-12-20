export * from './subscribers-update-metadata.service';
export * from './subscribers-find-by-natural-person-id.service';
export * from './subscribers-find-one-by-id.service';
export * from './subscribers-find-one-by-username.service';
export * from './subscribers-find-one-by-id-with-login.service';
export * from './subscribers-get-info.service';
export * from './subscribers-query-by-username.service';
export * from './subscribers-query-global-by-username.service';
export * from './subscribers-set-password.service';
export * from './subscribers-delete-alternal.service';
export * from './subscribers-custom.service';
export * from './subscribers-find-one-by-term.service';
export * from './subscribers-update-two-factor-code.service';

import { SubscribersUpdateMetadataService } from './subscribers-update-metadata.service';
import { SubscribersFindByNaturalPersonIdService } from './subscribers-find-by-natural-person-id.service';
import { SubscribersFindOneByIdService } from './subscribers-find-one-by-id.service';
import { SubscribersFindOneByUsernameService } from './subscribers-find-one-by-username.service';
import { SubscribersFindOneByIdWithLoginService } from './subscribers-find-one-by-id-with-login.service';
import { SubscribersGetInfoService } from './subscribers-get-info.service';
import { SubscribersQueryByUsernameService } from './subscribers-query-by-username.service';
import { SubscribersQueryGlobalByUsernameService } from './subscribers-query-global-by-username.service';
import { SubscribersSetPasswordService } from './subscribers-set-password.service';
import { SubscribersDeleteAlternalService } from './subscribers-delete-alternal.service';
import { SubscribersCustomService } from './subscribers-custom.service';
import { SubscribersFindOneByTermService } from './subscribers-find-one-by-term.service';
import { SubscribersUpdateTwoFactorCodeService } from './subscribers-update-two-factor-code.service';

export const subscribersCustomProviders = [
  SubscribersUpdateMetadataService,
  SubscribersFindByNaturalPersonIdService,
  SubscribersFindOneByIdService,
  SubscribersFindOneByUsernameService,
  SubscribersFindOneByIdWithLoginService,
  SubscribersGetInfoService,
  SubscribersQueryByUsernameService,
  SubscribersQueryGlobalByUsernameService,
  SubscribersSetPasswordService,
  SubscribersDeleteAlternalService,
  SubscribersCustomService,
  SubscribersFindOneByTermService,
  SubscribersUpdateTwoFactorCodeService,
];
