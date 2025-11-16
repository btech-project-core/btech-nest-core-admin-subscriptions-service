export * from './designe-mode-is-valid.service';
export * from './designe-mode-validation.service';

import { DesigneModeIsValidService } from './designe-mode-is-valid.service';
import { DesigneModeValidationService } from './designe-mode-validation.service';

export const DESIGNE_MODE_VALIDATION_SERVICES = [
  DesigneModeIsValidService,
  DesigneModeValidationService,
];
