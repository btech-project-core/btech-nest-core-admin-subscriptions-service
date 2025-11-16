import { Injectable } from '@nestjs/common';
import {
  CreateDesigneModeDto,
  CreateDesigneModeResponseDto,
} from 'src/designe-mode/dto/create-designe-mode.dto';
import {
  UpdateDesigneModeDto,
  UpdateDesigneModeResponseDto,
} from 'src/designe-mode/dto/update-designe-mode.dto';
import {
  FindAllDesigneModeDto,
  FindAllDesigneModeResponseDto,
} from 'src/designe-mode/dto/find-all-designe-mode.dto';
import {
  UpdateDesigneModeStatusDto,
  UpdateDesigneModeStatusResponseDto,
} from 'src/designe-mode/dto/update-designe-mode-status.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import { DesignerMode } from 'src/designe-mode/entities/designe-mode.entity';
import { DesigneModeCreateService } from './designe-mode-create.service';
import { DesigneModeFindAllService } from './designe-mode-find-all.service';
import { DesigneModeFindOneService } from './designe-mode-find-one.service';
import { DesigneModeUpdateService } from './designe-mode-update.service';
import { DesigneModeUpdateStatusService } from './designe-mode-update-status.service';

@Injectable()
export class DesigneModeCoreService {
  constructor(
    private readonly designeModeCreateService: DesigneModeCreateService,
    private readonly designeModeFindAllService: DesigneModeFindAllService,
    private readonly designeModeFindOneService: DesigneModeFindOneService,
    private readonly designeModeUpdateService: DesigneModeUpdateService,
    private readonly designeModeUpdateStatusService: DesigneModeUpdateStatusService,
  ) {}

  async create(
    createDesigneModeDto: CreateDesigneModeDto,
  ): Promise<CreateDesigneModeResponseDto> {
    return await this.designeModeCreateService.execute(createDesigneModeDto);
  }

  async findAll(
    findAllDesigneModeDto: FindAllDesigneModeDto,
  ): Promise<
    | FindAllDesigneModeResponseDto[]
    | PaginationResponseDto<FindAllDesigneModeResponseDto>
  > {
    return await this.designeModeFindAllService.execute(findAllDesigneModeDto);
  }

  async findOne(
    designerModeId: string,
    subscriptionDetailId: string,
  ): Promise<DesignerMode> {
    return await this.designeModeFindOneService.execute(
      designerModeId,
      subscriptionDetailId,
    );
  }

  async update(
    updateDesigneModeDto: UpdateDesigneModeDto,
  ): Promise<UpdateDesigneModeResponseDto> {
    return await this.designeModeUpdateService.execute(updateDesigneModeDto);
  }

  async updateStatus(
    updateDesigneModeStatusDto: UpdateDesigneModeStatusDto,
  ): Promise<UpdateDesigneModeStatusResponseDto> {
    return await this.designeModeUpdateStatusService.execute(
      updateDesigneModeStatusDto,
    );
  }
}
