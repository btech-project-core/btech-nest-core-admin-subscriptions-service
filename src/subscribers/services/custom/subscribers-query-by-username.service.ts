import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Subscriber } from '../../entities';
import { envs } from 'src/config';
import { CodeService, CodeFeatures } from 'src/common/enums';

@Injectable()
export class SubscribersQueryByUsernameService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
  ) {}

  async execute(
    username: string,
    domain: string,
    service: CodeService,
  ): Promise<Subscriber | null> {
    const queryBuilder =
      this.subscriberRepository.createQueryBuilder('subscriber');
    queryBuilder
      .leftJoinAndSelect(
        'subscriber.subscriptionsBussine',
        'subscriptionsBussine',
      )
      .innerJoin(
        'subscriptionsBussine.subscriptionDetail',
        'subscriptionDetail',
      )
      .innerJoin(
        'subscriptionDetail.subscriptionsService',
        'subscriptionsService',
        'subscriptionsService.code = :service',
        { service },
      )
      .leftJoinAndSelect(
        'subscriptionsBussine.subscriptionDetail',
        'subscriptionDetailLoaded',
        'subscriptionDetailLoaded.subscriptionDetailId = subscriptionDetail.subscriptionDetailId',
      )
      .leftJoinAndSelect(
        'subscriptionDetailLoaded.subscriptionsService',
        'subscriptionsServiceLoaded',
      )
      .leftJoinAndSelect('subscriptionsBussine.subscription', 'subscription')
      .leftJoinAndSelect(
        'subscriber.subscribersSubscriptionDetails',
        'subscribersSubscriptionDetails',
      )
      .leftJoinAndSelect(
        'subscribersSubscriptionDetails.subscriberRoles',
        'subscriberRoles',
      )
      .leftJoinAndSelect('subscriberRoles.role', 'role')
      .leftJoinAndSelect(
        'role.roleSubscriptionDetails',
        'roleSubscriptionDetails',
      )
      .leftJoinAndSelect(
        'roleSubscriptionDetails.subscriptionDetail',
        'roleSubscriptionDetail',
      )
      .where('subscriber.username = :username', { username })
      .andWhere('subscriber.isActive = :subscriberActive', {
        subscriberActive: true,
      })
      .andWhere(
        'subscribersSubscriptionDetails.subscriptionDetail = subscriptionDetail.subscriptionDetailId',
      )
      .andWhere('subscribersSubscriptionDetails.isActive = :isActive', {
        isActive: true,
      })
      .andWhere('subscriberRoles.isActive = :roleActive', { roleActive: true });

    if (domain !== envs.domain.principal) {
      queryBuilder
        .leftJoinAndSelect(
          'subscriptionDetailLoaded.subscriptionDetailFeatures',
          'subscriptionDetailFeatures',
        )
        .leftJoinAndSelect(
          'subscriptionDetailFeatures.subscriptionFeatures',
          'subscriptionFeatures',
        );
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(
            'subscriptionDetail.subscriptionDetailId = :subscriptionDetailId',
            { subscriptionDetailId: domain },
          ).orWhere(
            'subscriptionFeatures.code = :code AND subscriptionDetailFeatures.value = :domain',
            {
              code: CodeFeatures.DOM,
              domain: domain,
            },
          );
        }),
      );
    }
    const subscriber = await queryBuilder.getOne();
    return subscriber || null;
  }
}
