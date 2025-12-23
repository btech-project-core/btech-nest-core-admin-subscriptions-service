import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubscriptionDetailCoreService } from '../services/core';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import {
  FindAllSubscriptionDetailDto,
  FindAllSubscriptionDetailResponseDto,
} from '../dto/find-all-subscription-detail.dto';

@Controller()
export class SubscriptionsDetailCoreController {
  constructor(
    private readonly subscriptionDetailCoreService: SubscriptionDetailCoreService,
  ) {}

  @MessagePattern('subscriptionsDetail.findAll')
  async findAll(
    @Payload() findAllSubscriptionDetailDto: FindAllSubscriptionDetailDto,
  ): Promise<
    | FindAllSubscriptionDetailResponseDto[]
    | PaginationResponseDto<FindAllSubscriptionDetailResponseDto>
  > {
    return await this.subscriptionDetailCoreService.findAll(
      findAllSubscriptionDetailDto,
    );
  }
}
