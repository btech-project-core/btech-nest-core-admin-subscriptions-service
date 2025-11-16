import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionDetailDesigneMode } from './entities/subscription-detail-designe-mode.entity';
import { SUBSCRIPTION_DETAIL_DESIGNE_MODE_CONTROLLERS } from './controllers';
import { SUBSCRIPTION_DETAIL_DESIGNE_MODE_CORE_SERVICES } from './services/core';
import { SUBSCRIPTION_DETAIL_DESIGNE_MODE_CUSTOM_SERVICES } from './services/custom';
import { SUBSCRIPTION_DETAIL_DESIGNE_MODE_VALIDATION_SERVICES } from './services/validation';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionDetailDesigneMode])],
  controllers: [...SUBSCRIPTION_DETAIL_DESIGNE_MODE_CONTROLLERS],
  providers: [
    ...SUBSCRIPTION_DETAIL_DESIGNE_MODE_CORE_SERVICES,
    ...SUBSCRIPTION_DETAIL_DESIGNE_MODE_CUSTOM_SERVICES,
    ...SUBSCRIPTION_DETAIL_DESIGNE_MODE_VALIDATION_SERVICES,
  ],
  exports: [
    ...SUBSCRIPTION_DETAIL_DESIGNE_MODE_CORE_SERVICES,
    ...SUBSCRIPTION_DETAIL_DESIGNE_MODE_CUSTOM_SERVICES,
    ...SUBSCRIPTION_DETAIL_DESIGNE_MODE_VALIDATION_SERVICES,
  ],
})
export class SubscriptionDetailDesigneModeModule {}
