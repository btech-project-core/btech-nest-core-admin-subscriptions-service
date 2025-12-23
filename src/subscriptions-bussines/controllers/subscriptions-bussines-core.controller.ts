import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubscriptionsBussinesCoreService } from '../services/core';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import {
  FindAllSubscriptionsBussineDto,
  FindAllSubscriptionsBussineResponseDto,
} from '../dto/find-all-subscriptions-bussine.dto';

@Controller()
export class SubscriptionsBussinesCoreController {
  constructor(
    private readonly subscriptionsBussinesCoreService: SubscriptionsBussinesCoreService,
  ) {}

  @MessagePattern('subscriptionsBussines.findAll')
  async findAll(
    @Payload() findAllSubscriptionsBussineDto: FindAllSubscriptionsBussineDto,
  ): Promise<
    | FindAllSubscriptionsBussineResponseDto[]
    | PaginationResponseDto<FindAllSubscriptionsBussineResponseDto>
  > {
    return await this.subscriptionsBussinesCoreService.findAll(
      findAllSubscriptionsBussineDto,
    );
  }
}
