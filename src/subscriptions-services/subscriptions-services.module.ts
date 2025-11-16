import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsService } from './entities/subscriptions-service.entity';
import { SUBSCRIPTIONS_SERVICES_CONTROLLERS } from './controllers';
import { SUBSCRIPTIONS_SERVICES_CORE_SERVICES } from './services/core';
import { SUBSCRIPTIONS_SERVICES_CUSTOM_SERVICES } from './services/custom';
import { SUBSCRIPTIONS_SERVICES_VALIDATION_SERVICES } from './services/validation';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionsService])],
  controllers: [...SUBSCRIPTIONS_SERVICES_CONTROLLERS],
  providers: [
    ...SUBSCRIPTIONS_SERVICES_CORE_SERVICES,
    ...SUBSCRIPTIONS_SERVICES_CUSTOM_SERVICES,
    ...SUBSCRIPTIONS_SERVICES_VALIDATION_SERVICES,
  ],
  exports: [...SUBSCRIPTIONS_SERVICES_VALIDATION_SERVICES],
})
export class SubscriptionsServicesModule {}
