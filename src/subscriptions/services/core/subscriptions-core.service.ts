import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from '../../dto/create-subscription.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import {
  FindAllSubscriptionDto,
  FindAllSubscriptionResponseDto,
} from '../../dto/find-all-subscription.dto';
import { Subscription } from '../../entities/subscription.entity';
import { SubscriptionsCreateService } from './subscriptions-create.service';
import { SubscriptionsFindAllService } from './subscriptions-find-all.service';

@Injectable()
export class SubscriptionsCoreService {
  constructor(
    private readonly subscriptionsCreateService: SubscriptionsCreateService,
    private readonly subscriptionsFindAllService: SubscriptionsFindAllService,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<FindAllSubscriptionResponseDto[]> {
    return await this.subscriptionsCreateService.execute(createSubscriptionDto);
  }

  async findAll(
    findAllSubscriptionDto: FindAllSubscriptionDto,
  ): Promise<PaginationResponseDto<Subscription>> {
    return await this.subscriptionsFindAllService.execute(
      findAllSubscriptionDto,
    );
  }
}
