import { Injectable } from '@nestjs/common';
import { CreateSubscriptionsBussineDto } from '../../dto/create-subscriptions-bussine.dto';
import { QueryRunner } from 'typeorm';
import { SubscriptionsBussine } from '../../entities/subscriptions-bussine.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { SubscriptionsService } from 'src/subscriptions-services/entities/subscriptions-service.entity';
import { SubscriptionsBussinesCreateService } from './subscriptions-bussines-create.service';
import { SubscriptionsBussinesFindOneService } from './subscriptions-bussines-find-one.service';

@Injectable()
export class SubscriptionsBussinesCoreService {
  constructor(
    private readonly subscriptionsBussinesCreateService: SubscriptionsBussinesCreateService,
    private readonly subscriptionsBussinesFindOneService: SubscriptionsBussinesFindOneService,
  ) {}

  async create(
    subscription: Subscription,
    createSubscriptionsBussineDto: CreateSubscriptionsBussineDto,
    subscriptionsServices: SubscriptionsService[],
    queryRunner?: QueryRunner,
  ) {
    return await this.subscriptionsBussinesCreateService.execute(
      subscription,
      createSubscriptionsBussineDto,
      subscriptionsServices,
      queryRunner,
    );
  }

  async findOne(subscriptionBussineId: string): Promise<SubscriptionsBussine> {
    return await this.subscriptionsBussinesFindOneService.execute(
      subscriptionBussineId,
    );
  }
}
