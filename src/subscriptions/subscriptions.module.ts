import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { CommonModule } from 'src/common/common.module';
import { SubscriptionsBussinesModule } from 'src/subscriptions-bussines/subscriptions-bussines.module';
import { SubscriptionsServicesModule } from 'src/subscriptions-services/subscriptions-services.module';
import { SubscribersModule } from 'src/subscribers/subscribers.module';
import { SUBSCRIPTIONS_CONTROLLERS } from './controllers';
import { SUBSCRIPTIONS_CORE_SERVICES } from './services/core';
import { SUBSCRIPTIONS_CUSTOM_SERVICES } from './services/custom';
import { SUBSCRIPTIONS_VALIDATION_SERVICES } from './services/validation';
import { SUBSCRIPTIONS_BULK_SERVICES } from './services/bulk';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription]),
    CommonModule,
    SubscriptionsBussinesModule,
    SubscriptionsServicesModule,
    SubscribersModule,
  ],
  controllers: [...SUBSCRIPTIONS_CONTROLLERS],
  providers: [
    ...SUBSCRIPTIONS_CORE_SERVICES,
    ...SUBSCRIPTIONS_CUSTOM_SERVICES,
    ...SUBSCRIPTIONS_VALIDATION_SERVICES,
    ...SUBSCRIPTIONS_BULK_SERVICES,
  ],
  exports: [
    ...SUBSCRIPTIONS_CORE_SERVICES,
    ...SUBSCRIPTIONS_CUSTOM_SERVICES,
    ...SUBSCRIPTIONS_VALIDATION_SERVICES,
    ...SUBSCRIPTIONS_BULK_SERVICES,
  ],
})
export class SubscriptionsModule {}
