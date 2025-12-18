export * from './subscribers-find-all.service';
export * from './subscribers-create.service';
export * from './subscribers-update.service';
export * from './subscribers-delete.service';
export * from './subscribers-core.service';
export * from './subscriber-role-create.service';
export * from './subscriber-role-core.service';
export * from './subscribers-find-one.service';

import { SubscribersFindAllService } from './subscribers-find-all.service';
import { SubscribersCreateService } from './subscribers-create.service';
import { SubscribersUpdateService } from './subscribers-update.service';
import { SubscribersDeleteService } from './subscribers-delete.service';
import { SubscribersCoreService } from './subscribers-core.service';
import { SubscriberRoleCreateService } from './subscriber-role-create.service';
import { SubscriberRoleCoreService } from './subscriber-role-core.service';
import { SubscribersFindOneService } from './subscribers-find-one.service';

export const SUBSCRIBERS_CORE_SERVICES = [
  SubscribersFindAllService,
  SubscribersCreateService,
  SubscribersUpdateService,
  SubscribersDeleteService,
  SubscribersCoreService,
  SubscriberRoleCreateService,
  SubscriberRoleCoreService,
  SubscribersFindOneService,
];
