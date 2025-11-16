import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionDetail } from './entities/subscription-detail.entity';
import { SubscriptionDetailFeatures } from './entities/subscription-detail-features.entity';
import { SubscriptionsBussinesModule } from 'src/subscriptions-bussines/subscriptions-bussines.module';
import { SubscriptionsServicesModule } from 'src/subscriptions-services/subscriptions-services.module';
import { SUBSCRIPTIONS_DETAIL_CONTROLLERS } from './controllers';
import { SUBSCRIPTIONS_DETAIL_CORE_SERVICES } from './services/core';
import { SUBSCRIPTIONS_DETAIL_CUSTOM_SERVICES } from './services/custom';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionDetail, SubscriptionDetailFeatures]),
    forwardRef(() => SubscriptionsBussinesModule),
    SubscriptionsServicesModule,
  ],
  controllers: [...SUBSCRIPTIONS_DETAIL_CONTROLLERS],
  providers: [
    ...SUBSCRIPTIONS_DETAIL_CORE_SERVICES,
    ...SUBSCRIPTIONS_DETAIL_CUSTOM_SERVICES,
  ],
  exports: [
    ...SUBSCRIPTIONS_DETAIL_CORE_SERVICES,
    ...SUBSCRIPTIONS_DETAIL_CUSTOM_SERVICES,
  ],
})
export class SubscriptionsDetailModule {}
