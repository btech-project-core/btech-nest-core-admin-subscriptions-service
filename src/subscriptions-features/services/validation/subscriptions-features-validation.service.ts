import { Injectable } from '@nestjs/common';
import { SubscriptionFeatures } from '../../entities/subscription-features.entity';
import { SubscriptionsFeaturesIsValidService } from './subscriptions-features-is-valid.service';

@Injectable()
export class SubscriptionsFeaturesValidationService {
  constructor(
    private readonly subscriptionsFeaturesIsValidService: SubscriptionsFeaturesIsValidService,
  ) {}

  async isValidSubscriptionFeatures(
    subscriptionFeaturesId: string,
  ): Promise<SubscriptionFeatures> {
    return await this.subscriptionsFeaturesIsValidService.execute(
      subscriptionFeaturesId,
    );
  }
}
