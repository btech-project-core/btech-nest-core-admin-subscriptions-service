import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { CreateSubscriptionDto } from '../../dto/create-subscription.dto';
import { Subscription } from '../../entities/subscription.entity';
import { ModalitySubscription } from '../../enums/modality-subscription.enum';
import { SubscriptionsService } from 'src/subscriptions-services/entities/subscriptions-service.entity';
import { SubscriptionsBussinesCoreService } from 'src/subscriptions-bussines/services/core';
import { SubscribersBulkService } from 'src/subscribers/services/bulk';

@Injectable()
export class SubscriptionsCreateBussinesService {
  constructor(
    private readonly subscriptionsBussinesCoreService: SubscriptionsBussinesCoreService,
    private readonly subscribersBulkService: SubscribersBulkService,
  ) {}

  async execute(
    createSubscriptionDto: CreateSubscriptionDto,
    subscription: Subscription,
    subscriptionsServices: SubscriptionsService[],
    queryRunner?: QueryRunner,
  ) {
    const { modality, personId, subscriptionsBusiness } = createSubscriptionDto;

    if (modality === ModalitySubscription.CORPORATE) {
      for (const dto of subscriptionsBusiness) {
        const subscriptionsBussine =
          await this.subscriptionsBussinesCoreService.create(
            subscription,
            dto,
            subscriptionsServices,
            queryRunner,
          );

        if (dto.naturalPersons && dto.naturalPersons.length > 0) {
          await this.subscribersBulkService.createSubscribersForNaturalPersons(
            dto.naturalPersons,
            subscriptionsBussine,
            subscriptionsBussine.subscriptionDetail, // Pasar todos los subscriptionDetails de esta empresa
            queryRunner,
          );
        }
      }
    } else {
      const businessDto = subscriptionsBusiness[0];
      const subscriptionsBussine =
        await this.subscriptionsBussinesCoreService.create(
          subscription,
          {
            personId,
            subscriptionDetails: businessDto.subscriptionDetails,
          },
          subscriptionsServices,
          queryRunner,
        );

      if (businessDto.naturalPersons && businessDto.naturalPersons.length > 0) {
        await this.subscribersBulkService.createSubscribersForNaturalPersons(
          businessDto.naturalPersons,
          subscriptionsBussine,
          subscriptionsBussine.subscriptionDetail, // Pasar todos los subscriptionDetails de esta empresa
          queryRunner,
        );
      }
    }
  }
}
