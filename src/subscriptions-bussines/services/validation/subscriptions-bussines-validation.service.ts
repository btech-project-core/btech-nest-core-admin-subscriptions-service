import { Injectable } from '@nestjs/common';
import { SubscriptionsBussinesCheckActiveByJuridicalPersonService } from './subscriptions-bussines-check-active-by-juridical-person.service';

@Injectable()
export class SubscriptionsBussinesValidationService {
  constructor(
    private readonly subscriptionsBussinesCheckActiveByJuridicalPersonService: SubscriptionsBussinesCheckActiveByJuridicalPersonService,
  ) {}

  async checkActiveSubscriptionsByJuridicalPersonId(
    juridicalPersonId: string,
  ): Promise<boolean> {
    return await this.subscriptionsBussinesCheckActiveByJuridicalPersonService.execute(
      juridicalPersonId,
    );
  }
}
