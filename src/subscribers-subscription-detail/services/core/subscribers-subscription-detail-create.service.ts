import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { SubscribersSubscriptionDetail } from '../../entities/subscribers-subscription-detail.entity';
import { Subscriber } from '../../../subscribers/entities/subscriber.entity';
import { SubscriptionDetail } from '../../../subscriptions-detail/entities/subscription-detail.entity';

@Injectable()
export class SubscribersSubscriptionDetailCreateService {
  constructor(
    @InjectRepository(SubscribersSubscriptionDetail)
    private readonly subscribersSubscriptionDetailRepository: Repository<SubscribersSubscriptionDetail>,
  ) {}

  async execute(
    subscriber: Subscriber,
    subscriptionDetail: SubscriptionDetail,
    isActive: boolean = true,
    queryRunner?: QueryRunner,
  ): Promise<SubscribersSubscriptionDetail> {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(SubscribersSubscriptionDetail)
      : this.subscribersSubscriptionDetailRepository;
    const subscribersSubscriptionDetail = repository.create({
      subscriber,
      subscriptionDetail,
      isActive,
    });
    return await repository.save(subscribersSubscriptionDetail);
  }
}
