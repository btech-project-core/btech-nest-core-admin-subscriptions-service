import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import {
  CreateSubscriptionsTypeDto,
  CreateSubscriptionsTypeResponseDto,
} from '../dto/create-subscriptions-type.dto';
import {
  FindAllSubscriptionsTypeDto,
  FindAllSubscriptionsTypeResponseDto,
} from '../dto/find-all-subscriptions-type.dto';
import {
  FindOneSubscriptionsTypeDto,
  FindOneSubscriptionsTypeResponseDto,
} from '../dto/find-one-subscriptions-type.dto';
import {
  UpdateSubscriptionsTypeDto,
  UpdateSubscriptionsTypeResponseDto,
} from '../dto/update-subscriptions-type.dto';
import {
  UpdateSubscriptionsTypeStatusDto,
  UpdateSubscriptionsTypeStatusResponseDto,
} from '../dto/update-subscriptions-type-status.dto';
import { SubscriptionsTypeCoreService } from '../services/core';

@Controller()
export class SubscriptionsTypeCoreController {
  constructor(
    private readonly subscriptionsTypeCoreService: SubscriptionsTypeCoreService,
  ) {}

  @MessagePattern('subscriptionsType.create')
  async create(
    @Payload() createSubscriptionsTypeDto: CreateSubscriptionsTypeDto,
  ): Promise<CreateSubscriptionsTypeResponseDto> {
    return await this.subscriptionsTypeCoreService.create(
      createSubscriptionsTypeDto,
    );
  }

  @MessagePattern('subscriptionsType.findAll')
  async findAll(
    @Payload() findAllDto: FindAllSubscriptionsTypeDto,
  ): Promise<
    | FindAllSubscriptionsTypeResponseDto[]
    | PaginationResponseDto<FindAllSubscriptionsTypeResponseDto>
  > {
    return await this.subscriptionsTypeCoreService.findAll(findAllDto);
  }

  @MessagePattern('subscriptionsType.findOne')
  async findOne(
    @Payload() findOneDto: FindOneSubscriptionsTypeDto,
  ): Promise<FindOneSubscriptionsTypeResponseDto> {
    return await this.subscriptionsTypeCoreService.findOne(
      findOneDto.subscriptionTypeId,
    );
  }

  @MessagePattern('subscriptionsType.update')
  async update(
    @Payload() updateDto: UpdateSubscriptionsTypeDto,
  ): Promise<UpdateSubscriptionsTypeResponseDto> {
    return await this.subscriptionsTypeCoreService.update(updateDto);
  }

  @MessagePattern('subscriptionsType.updateStatus')
  async updateStatus(
    @Payload() updateStatusDto: UpdateSubscriptionsTypeStatusDto,
  ): Promise<UpdateSubscriptionsTypeStatusResponseDto> {
    return await this.subscriptionsTypeCoreService.updateStatus(
      updateStatusDto,
    );
  }
}
