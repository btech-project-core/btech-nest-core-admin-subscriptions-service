import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscribersSubscriptionDetail } from './entities/subscribers-subscription-detail.entity';
import { SUBSCRIBERS_SUBSCRIPTION_DETAIL_CONTROLLERS } from './controllers';
import { SUBSCRIBERS_SUBSCRIPTION_DETAIL_CORE_SERVICES } from './services/core';

@Module({
  imports: [TypeOrmModule.forFeature([SubscribersSubscriptionDetail])],
  controllers: [...SUBSCRIBERS_SUBSCRIPTION_DETAIL_CONTROLLERS],
  providers: [...SUBSCRIBERS_SUBSCRIPTION_DETAIL_CORE_SERVICES],
  exports: [...SUBSCRIBERS_SUBSCRIPTION_DETAIL_CORE_SERVICES],
})
export class SubscribersSubscriptionDetailModule {}
