import { Injectable } from '@nestjs/common';
import { SubscriptionsTypeRelatedSubscriptionsService } from './subscriptions-type-related-subscriptions.service';

@Injectable()
export class SubscriptionsTypeCustomService {
  constructor(
    private readonly subscriptionsTypeRelatedSubscriptionsService: SubscriptionsTypeRelatedSubscriptionsService,
  ) {}
  async relatedSubscriptions(subscriptionTypeId: string): Promise<void> {
    return await this.subscriptionsTypeRelatedSubscriptionsService.execute(
      subscriptionTypeId,
    );
  }
}
