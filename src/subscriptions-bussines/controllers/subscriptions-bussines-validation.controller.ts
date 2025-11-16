import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubscriptionsBussinesValidationService } from '../services/validation';

@Controller()
export class SubscriptionsBussinesValidationController {
  constructor(
    private readonly subscriptionsBussinesValidationService: SubscriptionsBussinesValidationService,
  ) {}

  @MessagePattern(
    'subscriptionBussines.checkActiveSubscriptionsByJuridicalPersonId',
  )
  async checkActiveSubscriptionsByJuridicalPersonId(
    @Payload('juridicalPersonId', ParseUUIDPipe) juridicalPersonId: string,
  ): Promise<boolean> {
    return this.subscriptionsBussinesValidationService.checkActiveSubscriptionsByJuridicalPersonId(
      juridicalPersonId,
    );
  }
}
