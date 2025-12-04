import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscribersSubscriptionDetail } from './entities/subscribers-subscription-detail.entity';
import { SUBSCRIBERS_SUBSCRIPTION_DETAIL_CONTROLLERS } from './controllers';
import { SUBSCRIBERS_SUBSCRIPTION_DETAIL_CORE_SERVICES } from './services/core';
import { subscribersSubscriptionDetailCustomProviders } from './services/custom';
import { subscribersSubscriptionDetailValidationProviders } from './services/validation';
import { CommonModule } from 'src/common/common.module';
import { SubscribersModule } from 'src/subscribers/subscribers.module';
import { SubscriptionsDetailModule } from 'src/subscriptions-detail/subscriptions-detail.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscribersSubscriptionDetail]),
    CommonModule,
    forwardRef(() => SubscribersModule),
    forwardRef(() => SubscriptionsDetailModule),
    RolesModule,
  ],
  controllers: [...SUBSCRIBERS_SUBSCRIPTION_DETAIL_CONTROLLERS],
  providers: [
    ...SUBSCRIBERS_SUBSCRIPTION_DETAIL_CORE_SERVICES,
    ...subscribersSubscriptionDetailCustomProviders,
    ...subscribersSubscriptionDetailValidationProviders,
  ],
  exports: [
    ...SUBSCRIBERS_SUBSCRIPTION_DETAIL_CORE_SERVICES,
    ...subscribersSubscriptionDetailCustomProviders,
    ...subscribersSubscriptionDetailValidationProviders,
  ],
})
export class SubscribersSubscriptionDetailModule {}
