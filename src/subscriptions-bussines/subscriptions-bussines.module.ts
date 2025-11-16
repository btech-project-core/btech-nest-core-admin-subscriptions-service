import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsBussine } from './entities/subscriptions-bussine.entity';
import { SubscriptionsDetailModule } from 'src/subscriptions-detail/subscriptions-detail.module';
import { SUBSCRIPTIONS_BUSSINES_CONTROLLERS } from './controllers';
import { SUBSCRIPTIONS_BUSSINES_CORE_SERVICES } from './services/core';
import { SUBSCRIPTIONS_BUSSINES_CUSTOM_SERVICES } from './services/custom';
import { SUBSCRIPTIONS_BUSSINES_VALIDATION_SERVICES } from './services/validation';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionsBussine]),
    forwardRef(() => SubscriptionsDetailModule),
  ],
  controllers: [...SUBSCRIPTIONS_BUSSINES_CONTROLLERS],
  providers: [
    ...SUBSCRIPTIONS_BUSSINES_CORE_SERVICES,
    ...SUBSCRIPTIONS_BUSSINES_CUSTOM_SERVICES,
    ...SUBSCRIPTIONS_BUSSINES_VALIDATION_SERVICES,
  ],
  exports: [
    ...SUBSCRIPTIONS_BUSSINES_CORE_SERVICES,
    ...SUBSCRIPTIONS_BUSSINES_CUSTOM_SERVICES,
    ...SUBSCRIPTIONS_BUSSINES_VALIDATION_SERVICES,
  ],
})
export class SubscriptionsBussinesModule {}
