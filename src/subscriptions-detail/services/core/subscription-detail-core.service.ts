import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { SubscriptionDetail } from '../../entities/subscription-detail.entity';
import { CreateSubscriptionDetailDto } from '../../dto/create-subscription-detail.dto';
import { SubscriptionsBussine } from 'src/subscriptions-bussines/entities/subscriptions-bussine.entity';
import { SubscriptionsService } from 'src/subscriptions-services/entities/subscriptions-service.entity';
import { SubscriptionDetailCreateService } from './subscription-detail-create.service';

@Injectable()
export class SubscriptionDetailCoreService {
  constructor(
    private readonly subscriptionDetailCreateService: SubscriptionDetailCreateService,
  ) {}

  async create(
    subscriptionsBussine: SubscriptionsBussine,
    createSubscriptionDetailsDto: CreateSubscriptionDetailDto[],
    subscriptionsServices: SubscriptionsService[],
    queryRunner?: QueryRunner,
  ): Promise<SubscriptionDetail[]> {
    return await this.subscriptionDetailCreateService.execute(
      subscriptionsBussine,
      createSubscriptionDetailsDto,
      subscriptionsServices,
      queryRunner,
    );
  }
}
