import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriberDesignePreference } from './entities/subscriber-designe-preference.entity';
import { Subscriber } from 'src/subscribers/entities/subscriber.entity';
import { SubscriptionDetailDesigneMode } from 'src/subscription-detail-designe-mode/entities/subscription-detail-designe-mode.entity';
import { SubscribersModule } from 'src/subscribers/subscribers.module';
import { SUBSCRIBER_DESIGNE_PREFERENCE_CONTROLLERS } from './controllers';
import { SUBSCRIBER_DESIGNE_PREFERENCE_CORE_SERVICES } from './services/core';
import { SUBSCRIBER_DESIGNE_PREFERENCE_VALIDATION_SERVICES } from './services/validation';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubscriberDesignePreference,
      Subscriber,
      SubscriptionDetailDesigneMode,
    ]),
    SubscribersModule,
  ],
  controllers: [...SUBSCRIBER_DESIGNE_PREFERENCE_CONTROLLERS],
  providers: [
    ...SUBSCRIBER_DESIGNE_PREFERENCE_CORE_SERVICES,
    ...SUBSCRIBER_DESIGNE_PREFERENCE_VALIDATION_SERVICES,
  ],
  exports: [...SUBSCRIBER_DESIGNE_PREFERENCE_VALIDATION_SERVICES],
})
export class SubscriberDesignePreferenceModule {}
