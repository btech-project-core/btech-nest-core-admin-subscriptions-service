import { Injectable } from '@nestjs/common';
import { SubscriptionsServicesRelatedService } from './subscriptions-services-related.service';

@Injectable()
export class SubscriptionsServicesCustomService {
  constructor(
    private readonly subscriptionsServicesRelatedService: SubscriptionsServicesRelatedService,
  ) {}

  async relatedSubscriptionServices(
    subscriptionsServiceId: string,
  ): Promise<void> {
    return await this.subscriptionsServicesRelatedService.execute(
      subscriptionsServiceId,
    );
  }
}
