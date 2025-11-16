export * from './designe-mode-create.service';
export * from './designe-mode-find-all.service';
export * from './designe-mode-find-one.service';
export * from './designe-mode-update.service';
export * from './designe-mode-update-status.service';
export * from './designe-mode-core.service';

import { DesigneModeCreateService } from './designe-mode-create.service';
import { DesigneModeFindAllService } from './designe-mode-find-all.service';
import { DesigneModeFindOneService } from './designe-mode-find-one.service';
import { DesigneModeUpdateService } from './designe-mode-update.service';
import { DesigneModeUpdateStatusService } from './designe-mode-update-status.service';
import { DesigneModeCoreService } from './designe-mode-core.service';

export const DESIGNE_MODE_CORE_SERVICES = [
  DesigneModeCreateService,
  DesigneModeFindAllService,
  DesigneModeFindOneService,
  DesigneModeUpdateService,
  DesigneModeUpdateStatusService,
  DesigneModeCoreService,
];
