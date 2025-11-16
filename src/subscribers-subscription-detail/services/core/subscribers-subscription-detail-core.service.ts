import { Injectable } from '@nestjs/common';
import { SubscribersSubscriptionDetail } from '../../entities/subscribers-subscription-detail.entity';
import { Subscriber } from '../../../subscribers/entities/subscriber.entity';
import { SubscriptionDetail } from '../../../subscriptions-detail/entities/subscription-detail.entity';
import { SubscribersSubscriptionDetailCreateService } from './subscribers-subscription-detail-create.service';

@Injectable()
export class SubscribersSubscriptionDetailCoreService {
  constructor(
    private readonly subscribersSubscriptionDetailCreateService: SubscribersSubscriptionDetailCreateService,
  ) {}

  async create(
    subscriber: Subscriber,
    subscriptionDetail: SubscriptionDetail,
    isActive: boolean = true,
  ): Promise<SubscribersSubscriptionDetail> {
    return await this.subscribersSubscriptionDetailCreateService.execute(
      subscriber,
      subscriptionDetail,
      isActive,
    );
  }
}
