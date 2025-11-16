import { Injectable } from '@nestjs/common';
import { DesigneModeRelatedDesigneSettingsService } from './designe-mode-related-designe-settings.service';

@Injectable()
export class DesigneModeCustomService {
  constructor(
    private readonly designeModeRelatedDesigneSettingsService: DesigneModeRelatedDesigneSettingsService,
  ) {}

  async relatedDesigneSettings(designerModeId: string): Promise<void> {
    return await this.designeModeRelatedDesigneSettingsService.execute(
      designerModeId,
    );
  }
}
