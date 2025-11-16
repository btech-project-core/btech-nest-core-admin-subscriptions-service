export * from './designe-mode-related-designe-settings.service';
export * from './designe-mode-custom.service';

import { DesigneModeRelatedDesigneSettingsService } from './designe-mode-related-designe-settings.service';
import { DesigneModeCustomService } from './designe-mode-custom.service';

export const DESIGNE_MODE_CUSTOM_SERVICES = [
  DesigneModeRelatedDesigneSettingsService,
  DesigneModeCustomService,
];
