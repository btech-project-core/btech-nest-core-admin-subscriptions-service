import { Injectable } from '@nestjs/common';
import { SubscriptionsTypeIsValidService } from './subscriptions-type-is-valid.service';
import { SubscriptionsType } from 'src/subscriptions-type/entities/subscriptions-type.entity';

@Injectable()
export class SubscriptionsTypeValidationService {
  constructor(
    private readonly SubscriptionsTypeIsValidService: SubscriptionsTypeIsValidService,
  ) {}

  async isValid(subscriptionTypeId: string): Promise<SubscriptionsType> {
    return await this.SubscriptionsTypeIsValidService.execute(
      subscriptionTypeId,
    );
  }
}
