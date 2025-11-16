import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsDesigneSetting } from './entities/subscriptions-designe-setting.entity';
import { SUBSCRIPTIONS_DESIGNE_SETTINGS_CONTROLLERS } from './controllers';
import { SUBSCRIPTIONS_DESIGNE_SETTINGS_CUSTOM_SERVICES } from './services/custom';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionsDesigneSetting])],
  controllers: [...SUBSCRIPTIONS_DESIGNE_SETTINGS_CONTROLLERS],
  providers: [...SUBSCRIPTIONS_DESIGNE_SETTINGS_CUSTOM_SERVICES],
  exports: [...SUBSCRIPTIONS_DESIGNE_SETTINGS_CUSTOM_SERVICES],
})
export class SubscriptionsDesigneSettingsModule {}
