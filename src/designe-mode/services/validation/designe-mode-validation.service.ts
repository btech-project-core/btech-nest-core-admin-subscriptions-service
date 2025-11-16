import { Injectable } from '@nestjs/common';
import { DesignerMode } from 'src/designe-mode/entities/designe-mode.entity';
import { DesigneModeIsValidService } from './designe-mode-is-valid.service';

@Injectable()
export class DesigneModeValidationService {
  constructor(
    private readonly designeModeIsValidService: DesigneModeIsValidService,
  ) {}

  async isValidDesignerMode(designerModeId: string): Promise<DesignerMode> {
    return await this.designeModeIsValidService.execute(designerModeId);
  }
}
