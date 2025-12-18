export * from './subscribers-send-registration-email.service';
export * from './subscribers-send-update-email.service';
export * from './subscribers-notification.service';

import { SubscribersSendRegistrationEmailService } from './subscribers-send-registration-email.service';
import { SubscribersSendUpdateEmailService } from './subscribers-send-update-email.service';
import { SubscribersNotificationService } from './subscribers-notification.service';

export const subscribersNotificationProviders = [
  SubscribersSendRegistrationEmailService,
  SubscribersSendUpdateEmailService,
  SubscribersNotificationService,
];
