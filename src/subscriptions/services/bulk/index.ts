export * from './subscriptions-format-bussines-with-person-data.service';
export * from './subscriptions-find-one-with-create-response.service';
export * from './subscriptions-bulk.service';

import { SubscriptionsFormatBussinesWithPersonDataService } from './subscriptions-format-bussines-with-person-data.service';
import { SubscriptionsFindOneWithCreateResponseService } from './subscriptions-find-one-with-create-response.service';
import { SubscriptionsBulkService } from './subscriptions-bulk.service';

export const SUBSCRIPTIONS_BULK_SERVICES = [
  SubscriptionsFormatBussinesWithPersonDataService,
  SubscriptionsFindOneWithCreateResponseService,
  SubscriptionsBulkService,
];
