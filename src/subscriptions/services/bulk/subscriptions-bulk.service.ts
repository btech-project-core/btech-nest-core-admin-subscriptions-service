import { Injectable } from '@nestjs/common';
import { SubscriptionsBussine } from 'src/subscriptions-bussines/entities/subscriptions-bussine.entity';
import { FindAllSubscriptionResponseDto } from '../../dto/find-all-subscription.dto';
import { SubscriptionsFormatBussinesWithPersonDataService } from './subscriptions-format-bussines-with-person-data.service';
import { SubscriptionsFindOneWithCreateResponseService } from './subscriptions-find-one-with-create-response.service';

@Injectable()
export class SubscriptionsBulkService {
  constructor(
    private readonly subscriptionsFormatBussinesWithPersonDataService: SubscriptionsFormatBussinesWithPersonDataService,
    private readonly subscriptionsFindOneWithCreateResponseService: SubscriptionsFindOneWithCreateResponseService,
  ) {}

  async formatSubscriptionsBussineWithPersonData(
    subscriptionsBussineList: SubscriptionsBussine[],
    term?: string,
  ): Promise<FindAllSubscriptionResponseDto[]> {
    return await this.subscriptionsFormatBussinesWithPersonDataService.execute(
      subscriptionsBussineList,
      term,
    );
  }

  async findOneWithCreateResponse(
    subscriptionId: string,
  ): Promise<FindAllSubscriptionResponseDto[]> {
    return await this.subscriptionsFindOneWithCreateResponseService.execute(
      subscriptionId,
    );
  }
}
