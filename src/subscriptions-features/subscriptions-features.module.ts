import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionFeatures } from './entities/subscription-features.entity';
import { SUBSCRIPTIONS_FEATURES_CONTROLLERS } from './controllers';
import { SUBSCRIPTIONS_FEATURES_CORE_SERVICES } from './services/core';
import { SUBSCRIPTIONS_FEATURES_CUSTOM_SERVICES } from './services/custom';
import { SUBSCRIPTIONS_FEATURES_VALIDATION_SERVICES } from './services/validation';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionFeatures])],
  controllers: [...SUBSCRIPTIONS_FEATURES_CONTROLLERS],
  providers: [
    ...SUBSCRIPTIONS_FEATURES_CORE_SERVICES,
    ...SUBSCRIPTIONS_FEATURES_CUSTOM_SERVICES,
    ...SUBSCRIPTIONS_FEATURES_VALIDATION_SERVICES,
  ],
  exports: [...SUBSCRIPTIONS_FEATURES_VALIDATION_SERVICES],
})
export class SubscriptionsFeaturesModule {}
