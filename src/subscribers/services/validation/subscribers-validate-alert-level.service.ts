import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscriber } from '../../entities';
import {
  SubscriberAlertLevelValidation,
  SubscriberAlertLevelRaw,
} from '../../interfaces';

@Injectable()
export class SubscribersValidateAlertLevelService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
  ) {}

  async execute(
    subscriberIds: string[],
    levelAlertCode: string,
  ): Promise<SubscriberAlertLevelValidation[]> {
    const results: SubscriberAlertLevelRaw[] = await this.subscriberRepository
      .createQueryBuilder('subscriber')
      .leftJoin(
        'subscriber.subscribersSubscriptionDetails',
        'subscribersSubscriptionDetail',
      )
      .leftJoin(
        'subscribersSubscriptionDetail.subscriptionDetail',
        'subscriptionDetail',
      )
      .leftJoin(
        'subscriptionDetail.subscriptionsService',
        'subscriptionsService',
      )
      .leftJoin(
        'subscriptionDetail.subscriptionDetailFeatures',
        'subscriptionDetailFeatures',
      )
      .leftJoin(
        'subscriptionDetailFeatures.subscriptionFeatures',
        'subscriptionFeatures',
      )
      .select('subscriber.subscriberId', 'subscriberId')
      .addSelect('subscriptionDetailFeatures.value', 'value')
      .addSelect(
        'subscriptionDetail.subscriptionDetailId',
        'subscriptionDetailId',
      )
      .where('subscriber.subscriberId IN (:...subscriberIds)', {
        subscriberIds,
      })
      .andWhere('subscriptionFeatures.code = :levelAlertCode', {
        levelAlertCode,
      })
      .andWhere('subscriptionsService.code = :serviceCode', {
        serviceCode: 'VDI',
      })
      .getRawMany();

    return results.map((row) => ({
      subscriberId: row.subscriberId,
      hasAlertLevel: true,
      alertMinutesBefore: row.value ? parseInt(row.value, 10) : undefined,
      subscriptionDetailId: row.subscriptionDetailId,
    }));
  }
}
