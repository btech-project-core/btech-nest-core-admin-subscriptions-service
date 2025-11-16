import { Injectable } from '@nestjs/common';
import { SubscriptionsFeaturesRelatedService } from './subscriptions-features-related.service';

@Injectable()
export class SubscriptionsFeaturesCustomService {
  constructor(
    private readonly subscriptionsFeaturesRelatedService: SubscriptionsFeaturesRelatedService,
  ) {}

  async relatedSubscriptionDetails(
    subscriptionFeaturesId: string,
  ): Promise<void> {
    return await this.subscriptionsFeaturesRelatedService.execute(
      subscriptionFeaturesId,
    );
  }
}
