import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  FindAllSubscriptionsServiceDto,
  FindAllSubscriptionsServiceResponseDto,
} from '../dto/find-all-subscription-service.dto';
import {
  CreateSubscriptionsServiceDto,
  CreateSubscriptionsServiceResponseDto,
} from '../dto/create-subscriptions-service.dto';
import {
  UpdateSubscriptionsServiceDto,
  UpdateSubscriptionsServiceResponseDto,
} from '../dto/update-subscriptions-service.dto';
import {
  UpdateSubscriptionsServiceStatusDto,
  UpdateSubscriptionsServiceStatusResponseDto,
} from '../dto/update-subscriptions-service-status.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import { SubscriptionsServicesCoreService } from '../services/core';

@Controller()
export class SubscriptionsServicesCoreController {
  constructor(
    private readonly subscriptionsServicesCoreService: SubscriptionsServicesCoreService,
  ) {}

  @MessagePattern('subscriptionsServices.create')
  async create(
    @Payload() createSubscriptionsServiceDto: CreateSubscriptionsServiceDto,
  ): Promise<CreateSubscriptionsServiceResponseDto> {
    return await this.subscriptionsServicesCoreService.create(
      createSubscriptionsServiceDto,
    );
  }

  @MessagePattern('subscriptionsServices.findAll')
  async findAll(
    @Payload() findAllSubscriptionsServiceDto: FindAllSubscriptionsServiceDto,
  ): Promise<
    | FindAllSubscriptionsServiceResponseDto[]
    | PaginationResponseDto<FindAllSubscriptionsServiceResponseDto>
  > {
    return await this.subscriptionsServicesCoreService.findAll(
      findAllSubscriptionsServiceDto,
    );
  }

  @MessagePattern('subscriptionsServices.findOne')
  async findOne(
    @Payload('subscriptionsServiceId', ParseUUIDPipe)
    subscriptionsServiceId: string,
  ): Promise<FindAllSubscriptionsServiceResponseDto> {
    return await this.subscriptionsServicesCoreService.findOne(
      subscriptionsServiceId,
    );
  }

  @MessagePattern('subscriptionsServices.update')
  async update(
    @Payload() updateSubscriptionsServiceDto: UpdateSubscriptionsServiceDto,
  ): Promise<UpdateSubscriptionsServiceResponseDto> {
    return await this.subscriptionsServicesCoreService.update(
      updateSubscriptionsServiceDto,
    );
  }

  @MessagePattern('subscriptionsServices.updateStatus')
  async updateStatus(
    @Payload() updateStatusDto: UpdateSubscriptionsServiceStatusDto,
  ): Promise<UpdateSubscriptionsServiceStatusResponseDto> {
    return await this.subscriptionsServicesCoreService.updateStatus(
      updateStatusDto,
    );
  }
}
