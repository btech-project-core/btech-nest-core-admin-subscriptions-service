import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { CreateSubscriptionDto } from '../../dto/create-subscription.dto';
import { Subscription } from '../../entities/subscription.entity';
import { SubscriptionsService } from 'src/subscriptions-services/entities/subscriptions-service.entity';
import { SubscriptionsCreateBussinesService } from './subscriptions-create-bussines.service';

@Injectable()
export class SubscriptionsCustomService {
  constructor(
    private readonly subscriptionsCreateBussinesService: SubscriptionsCreateBussinesService,
  ) {}

  async createSubscriptionsBussine(
    createSubscriptionDto: CreateSubscriptionDto,
    subscription: Subscription,
    subscriptionsServices: SubscriptionsService[],
    queryRunner?: QueryRunner,
  ) {
    return await this.subscriptionsCreateBussinesService.execute(
      createSubscriptionDto,
      subscription,
      subscriptionsServices,
      queryRunner,
    );
  }
}
