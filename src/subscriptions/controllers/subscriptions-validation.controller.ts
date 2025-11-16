import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubscriptionsValidationService } from '../services/validation';

@Controller()
export class SubscriptionsValidationController {
  constructor(
    private readonly subscriptionsValidationService: SubscriptionsValidationService,
  ) {}

  @MessagePattern('subscriptions.checkActiveSubscriptionsByPersonId')
  checkActiveSubscriptionsByPersonId(
    @Payload('personId', ParseUUIDPipe) personId: string,
  ): Promise<boolean> {
    return this.subscriptionsValidationService.checkActiveSubscriptionsByPersonId(
      personId,
    );
  }
}
