import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DesignerMode } from 'src/designe-mode/entities/designe-mode.entity';
import {
  UpdateDesigneModeDto,
  UpdateDesigneModeResponseDto,
} from 'src/designe-mode/dto/update-designe-mode.dto';
import { formatDesigneModeResponse } from 'src/designe-mode/helpers/format-designe-mode-response.helper';
import { DesigneModeFindOneService } from './designe-mode-find-one.service';

@Injectable()
export class DesigneModeUpdateService {
  constructor(
    @InjectRepository(DesignerMode)
    private readonly designerModeRepository: Repository<DesignerMode>,
    private readonly designeModeFindOneService: DesigneModeFindOneService,
  ) {}

  async execute(
    updateDesigneModeDto: UpdateDesigneModeDto,
  ): Promise<UpdateDesigneModeResponseDto> {
    const { designerModeId, description, code, subscriptionDetailId } =
      updateDesigneModeDto;
    const designerMode = await this.designeModeFindOneService.execute(
      designerModeId,
      subscriptionDetailId!,
    );
    designerMode.description = description ?? designerMode.description;
    designerMode.code = code ?? designerMode.code;
    await this.designerModeRepository.save(designerMode);
    return formatDesigneModeResponse(designerMode);
  }
}
