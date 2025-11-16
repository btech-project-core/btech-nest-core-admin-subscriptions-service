import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DesignerMode } from 'src/designe-mode/entities/designe-mode.entity';
import {
  CreateDesigneModeDto,
  CreateDesigneModeResponseDto,
} from 'src/designe-mode/dto/create-designe-mode.dto';
import { formatDesigneModeResponse } from 'src/designe-mode/helpers/format-designe-mode-response.helper';

@Injectable()
export class DesigneModeCreateService {
  constructor(
    @InjectRepository(DesignerMode)
    private readonly designerModeRepository: Repository<DesignerMode>,
  ) {}

  async execute(
    createDesigneModeDto: CreateDesigneModeDto,
  ): Promise<CreateDesigneModeResponseDto> {
    const designerMode =
      this.designerModeRepository.create(createDesigneModeDto);
    await this.designerModeRepository.save(designerMode);
    return formatDesigneModeResponse(designerMode);
  }
}
