import { Injectable } from '@nestjs/common';
import { SubscriptionsService } from '../../entities/subscriptions-service.entity';
import { SubscriptionsServicesIsValidService } from './subscriptions-services-is-valid.service';
import { SubscriptionsServicesValidateExistService } from './subscriptions-services-validate-exist.service';

@Injectable()
export class SubscriptionsServicesValidationService {
  constructor(
    private readonly subscriptionsServicesIsValidService: SubscriptionsServicesIsValidService,
    private readonly subscriptionsServicesValidateExistService: SubscriptionsServicesValidateExistService,
  ) {}

  async isValidSubscriptionService(
    subscriptionsServiceId: string,
  ): Promise<SubscriptionsService> {
    return await this.subscriptionsServicesIsValidService.execute(
      subscriptionsServiceId,
    );
  }

  async validateSubscriptionServicesExist(
    subscriptionServiceIds: string[],
  ): Promise<SubscriptionsService[]> {
    return await this.subscriptionsServicesValidateExistService.execute(
      subscriptionServiceIds,
    );
  }
}
