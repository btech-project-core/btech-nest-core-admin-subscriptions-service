import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateDesigneModeDto,
  CreateDesigneModeResponseDto,
} from '../dto/create-designe-mode.dto';
import {
  UpdateDesigneModeDto,
  UpdateDesigneModeResponseDto,
} from '../dto/update-designe-mode.dto';
import {
  FindAllDesigneModeDto,
  FindAllDesigneModeResponseDto,
} from '../dto/find-all-designe-mode.dto';
import {
  UpdateDesigneModeStatusDto,
  UpdateDesigneModeStatusResponseDto,
} from '../dto/update-designe-mode-status.dto';
import { FindOneDesigneModeResponseDto } from '../dto/find-one-designe-mode.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import { DesigneModeCoreService } from '../services/core';

@Controller()
export class DesigneModeCoreController {
  constructor(
    private readonly designeModeCoreService: DesigneModeCoreService,
  ) {}

  @MessagePattern('designeMode.create')
  async create(
    @Payload() createDesigneModeDto: CreateDesigneModeDto,
  ): Promise<CreateDesigneModeResponseDto> {
    return await this.designeModeCoreService.create(createDesigneModeDto);
  }

  @MessagePattern('designeMode.findAll')
  async findAll(
    @Payload() findAllDesigneModeDto: FindAllDesigneModeDto,
  ): Promise<
    | FindAllDesigneModeResponseDto[]
    | PaginationResponseDto<FindAllDesigneModeResponseDto>
  > {
    return await this.designeModeCoreService.findAll(findAllDesigneModeDto);
  }

  @MessagePattern('designeMode.findOne')
  async findOne(
    @Payload('designerModeId', ParseUUIDPipe) designerModeId: string,
    @Payload('subscriptionDetailId', ParseUUIDPipe)
    subscriptionDetailId: string,
  ): Promise<FindOneDesigneModeResponseDto> {
    return await this.designeModeCoreService.findOne(
      designerModeId,
      subscriptionDetailId,
    );
  }

  @MessagePattern('designeMode.update')
  async update(
    @Payload() updateDesigneModeDto: UpdateDesigneModeDto,
  ): Promise<UpdateDesigneModeResponseDto> {
    return await this.designeModeCoreService.update(updateDesigneModeDto);
  }

  @MessagePattern('designeMode.updateStatus')
  async updateStatus(
    @Payload() updateStatusDto: UpdateDesigneModeStatusDto,
  ): Promise<UpdateDesigneModeStatusResponseDto> {
    return await this.designeModeCoreService.updateStatus(updateStatusDto);
  }
}
