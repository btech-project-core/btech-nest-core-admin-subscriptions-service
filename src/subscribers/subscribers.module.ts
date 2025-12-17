import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriber, SubscriberRole } from './entities';
import { SUBSCRIBERS_CONTROLLERS } from './controllers';
import { SUBSCRIBERS_CORE_SERVICES } from './services/core';
import { subscribersCustomProviders } from './services/custom';
import { subscribersValidationProviders } from './services/validation';
import { subscribersBulkProviders } from './services/bulk';
import { subscribersNotificationProviders } from './services/notification';
import { CommonModule } from 'src/common/common.module';
import { SubscriptionsBussinesModule } from 'src/subscriptions-bussines/subscriptions-bussines.module';
import { RolesModule } from 'src/roles/roles.module';
import { SubscriptionsDetailModule } from 'src/subscriptions-detail/subscriptions-detail.module';
import { SubscribersSubscriptionDetailModule } from 'src/subscribers-subscription-detail/subscribers-subscription-detail.module';
import { CommunicationsModule } from 'src/communications/communications.module';
import { SubscriptionDetailDesigneModeModule } from 'src/subscription-detail-designe-mode/subscription-detail-designe-mode.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscriber, SubscriberRole]),
    CommonModule,
    SubscriptionsBussinesModule,
    forwardRef(() => SubscriptionsDetailModule),
    forwardRef(() => SubscribersSubscriptionDetailModule),
    RolesModule,
    CommunicationsModule,
    SubscriptionDetailDesigneModeModule,
  ],
  controllers: [...SUBSCRIBERS_CONTROLLERS],
  providers: [
    ...SUBSCRIBERS_CORE_SERVICES,
    ...subscribersCustomProviders,
    ...subscribersValidationProviders,
    ...subscribersBulkProviders,
    ...subscribersNotificationProviders,
  ],
  exports: [
    ...SUBSCRIBERS_CORE_SERVICES,
    ...subscribersCustomProviders,
    ...subscribersValidationProviders,
    ...subscribersBulkProviders,
    ...subscribersNotificationProviders,
  ],
})
export class SubscribersModule {}
