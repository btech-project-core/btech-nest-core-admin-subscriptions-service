export * from './subscribers-find-with-natural-persons.service';
export * from './subscribers-get-count-by-detail.service';
export * from './subscribers-create-for-natural-persons.service';
export * from './subscribers-find-by-ids.service';
export * from './subscribers-bulk.service';
export * from './subscribers-create-bulk-from-natural-persons.service';

import { SubscribersFindWithNaturalPersonsService } from './subscribers-find-with-natural-persons.service';
import { SubscribersGetCountByDetailService } from './subscribers-get-count-by-detail.service';
import { SubscribersCreateForNaturalPersonsService } from './subscribers-create-for-natural-persons.service';
import { SubscribersFindByIdsService } from './subscribers-find-by-ids.service';
import { SubscribersBulkService } from './subscribers-bulk.service';
import { SubscribersCreateBulkFromNaturalPersonsService } from './subscribers-create-bulk-from-natural-persons.service';

export const subscribersBulkProviders = [
  SubscribersFindWithNaturalPersonsService,
  SubscribersGetCountByDetailService,
  SubscribersCreateForNaturalPersonsService,
  SubscribersFindByIdsService,
  SubscribersBulkService,
  SubscribersCreateBulkFromNaturalPersonsService,
];
