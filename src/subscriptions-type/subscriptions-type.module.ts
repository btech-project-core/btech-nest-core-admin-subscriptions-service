import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsType } from './entities/subscriptions-type.entity';
import { SUBSCRIPTIONS_TYPE_CONTROLLERS } from './controllers';
import { SUBSCRIPTIONS_TYPE_CUSTOM_SERVICES } from './services/custom';
import { SUBSCRIPTIONS_TYPE_VALIDATION_SERVICES } from './services/validation';
import { SUBSCRIPTIONS_TYPE_CORE_SERVICES } from './services/core';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionsType])],
  controllers: [...SUBSCRIPTIONS_TYPE_CONTROLLERS],
  providers: [
    ...SUBSCRIPTIONS_TYPE_CORE_SERVICES,
    ...SUBSCRIPTIONS_TYPE_CUSTOM_SERVICES,
    ...SUBSCRIPTIONS_TYPE_VALIDATION_SERVICES,
  ],
  exports: [
    ...SUBSCRIPTIONS_TYPE_VALIDATION_SERVICES,
    ...SUBSCRIPTIONS_TYPE_CUSTOM_SERVICES,
  ],
})
export class SubscriptionsTypeModule {}
