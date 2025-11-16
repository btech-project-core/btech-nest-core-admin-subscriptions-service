import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from '../../dto/create-subscription.dto';
import { extractAllServiceIds } from '../../helpers/extract-all-service-ids.helper';
import { extractAllPersonIds } from '../../helpers/extract-all-person-ids.helper';
import { SubscriptionsServicesValidationService } from 'src/subscriptions-services/services/validation';
import { AdminPersonsService } from 'src/common/services/admin-persons.service';
import { SubscriptionsValidateUniqueServicesService } from './subscriptions-validate-unique-services.service';

@Injectable()
export class SubscriptionsValidateAllEntitiesService {
  constructor(
    private readonly subscriptionsServicesValidationService: SubscriptionsServicesValidationService,
    private readonly adminPersonsService: AdminPersonsService,
    private readonly subscriptionsValidateUniqueServicesService: SubscriptionsValidateUniqueServicesService,
  ) {}

  async execute(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<{ subscriptionsServices: any[] }> {
    const { subscriptionsBusiness } = createSubscriptionDto;
    this.subscriptionsValidateUniqueServicesService.execute(
      subscriptionsBusiness,
    );
    const allServiceIds = extractAllServiceIds(subscriptionsBusiness);
    const allPersonIds = extractAllPersonIds(createSubscriptionDto);
    const subscriptionsServices =
      await this.subscriptionsServicesValidationService.validateSubscriptionServicesExist(
        allServiceIds,
      );
    if (allPersonIds.length > 0)
      await this.adminPersonsService.validatePersonsExist(allPersonIds);

    return { subscriptionsServices };
  }
}
