import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DesignerMode } from 'src/designe-mode/entities/designe-mode.entity';
import {
  UpdateDesigneModeStatusDto,
  UpdateDesigneModeStatusResponseDto,
} from 'src/designe-mode/dto/update-designe-mode-status.dto';
import { DesigneModeFindOneService } from './designe-mode-find-one.service';
import { DesigneModeCustomService } from '../custom';

@Injectable()
export class DesigneModeUpdateStatusService {
  constructor(
    @InjectRepository(DesignerMode)
    private readonly designerModeRepository: Repository<DesignerMode>,
    private readonly designeModeFindOneService: DesigneModeFindOneService,
    private readonly designeModeCustomService: DesigneModeCustomService,
  ) {}

  async execute(
    updateDesigneModeStatusDto: UpdateDesigneModeStatusDto,
  ): Promise<UpdateDesigneModeStatusResponseDto> {
    const { designerModeId, isActive, subscriptionDetailId } =
      updateDesigneModeStatusDto;
    const existingDesignerMode = await this.designeModeFindOneService.execute(
      designerModeId,
      subscriptionDetailId,
    );
    if (!isActive)
      await this.designeModeCustomService.relatedDesigneSettings(
        designerModeId,
      );
    await this.designerModeRepository.update(designerModeId, {
      isActive,
    });
    const statusMessage = isActive ? 'activado' : 'desactivado';
    return {
      message: `Modo de diseño '${existingDesignerMode.description}' ${statusMessage} exitosamente`,
    };
  }
}
