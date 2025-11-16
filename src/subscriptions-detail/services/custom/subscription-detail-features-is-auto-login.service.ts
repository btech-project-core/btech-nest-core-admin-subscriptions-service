import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionDetailFeatures } from '../../entities/subscription-detail-features.entity';
import { Repository } from 'typeorm';
import { StatusSubscription } from 'src/subscriptions/enums/status-subscription.enum';
import { CodeFeatures } from 'src/common/enums/code-features.enum';

@Injectable()
export class SubscriptionDetailFeaturesIsAutoLoginService {
  constructor(
    @InjectRepository(SubscriptionDetailFeatures)
    private readonly subscriptionsDetailFeaturesRepository: Repository<SubscriptionDetailFeatures>,
  ) {}

  async execute(
    subscriberId: string,
    subscriptionDetailId: string,
    subscriptionBussineId: string,
  ): Promise<boolean> {
    const item = await this.subscriptionsDetailFeaturesRepository
      .createQueryBuilder('subscriptionDetailFeatures')
      .innerJoin(
        'subscriptionDetailFeatures.subscriptionFeatures',
        'subscriptionFeatures',
      )
      .innerJoin(
        'subscriptionDetailFeatures.subscriptionDetail',
        'subscriptionDetail',
      )
      .innerJoin(
        'subscriptionDetail.subscriptionsBussine',
        'subscriptionsBussine',
      )
      .innerJoin('subscriptionsBussine.subscriber', 'subscriber')
      .innerJoin('subscriptionsBussine.subscription', 'subscription')
      .where('subscription.status = :status', {
        status: StatusSubscription.ACTIVE,
      })
      .andWhere(
        'subscriptionDetail.subscriptionDetailId = :subscriptionDetailId',
        {
          subscriptionDetailId,
        },
      )
      .andWhere(
        'subscriptionsBussine.subscriptionBussineId = :subscriptionBussineId',
        {
          subscriptionBussineId,
        },
      )
      .andWhere('subscriber.subscriberId = :subscriberId', {
        subscriberId,
      })
      .andWhere('subscriptionFeatures.code= :codeFeature', {
        codeFeature: CodeFeatures.AULOG,
      })
      .getOne();
    if (item && item.value === '1') return true;
    return false;
  }
}
