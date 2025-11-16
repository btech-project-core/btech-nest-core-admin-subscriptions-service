export * from './subscribers-validate-exists.service';
export * from './subscribers-check-active-by-natural-person.service';
export * from './subscribers-is-valid-by-natural-person-id.service';
export * from './subscribers-validate-alert-level.service';
export * from './subscribers-validation.service';

import { SubscribersValidateExistsService } from './subscribers-validate-exists.service';
import { SubscribersCheckActiveByNaturalPersonService } from './subscribers-check-active-by-natural-person.service';
import { SubscribersIsValidByNaturalPersonIdService } from './subscribers-is-valid-by-natural-person-id.service';
import { SubscribersValidateAlertLevelService } from './subscribers-validate-alert-level.service';
import { SubscribersValidationService } from './subscribers-validation.service';

export const subscribersValidationProviders = [
  SubscribersValidateExistsService,
  SubscribersCheckActiveByNaturalPersonService,
  SubscribersIsValidByNaturalPersonIdService,
  SubscribersValidateAlertLevelService,
  SubscribersValidationService,
];
