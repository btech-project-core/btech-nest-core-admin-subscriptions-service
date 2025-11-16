import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscriber } from '../../entities';
import { StatusSubscription } from 'src/subscriptions/enums';

@Injectable()
export class SubscribersGetCountByDetailService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
  ) {}

  async execute(subscriptionDetailId: string): Promise<string[]> {
    const queryBuilder = this.subscriberRepository
      .createQueryBuilder('subscriber')
      .innerJoin('subscriber.subscriptionsBussine', 'subscriptionsBussine')
      .innerJoin('subscriptionsBussine.subscription', 'subscription')
      .innerJoin(
        'subscriber.subscribersSubscriptionDetails',
        'subscribersSubscriptionDetails',
      )
      .innerJoin(
        'subscribersSubscriptionDetails.subscriptionDetail',
        'subscriptionDetail',
      )
      .where(
        'subscriptionDetail.subscriptionDetailId = :subscriptionDetailId',
        { subscriptionDetailId },
      )
      .andWhere('subscription.status = :status', {
        status: StatusSubscription.ACTIVE,
      })
      .andWhere('subscribersSubscriptionDetails.isActive = :isActive', {
        isActive: true,
      })
      .select(['subscriber.naturalPersonId']);

    const subscribers = await queryBuilder.getMany();
    return subscribers.map((s) => s.naturalPersonId);
  }
}
