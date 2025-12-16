import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Subscriber } from '../../entities';
import { AdminPersonsService } from 'src/common/services';
import { SERVICE_NAME } from 'src/config';
import { CodeService } from 'src/common/enums';
import { SubscriberInfoResponseDto } from 'src/common/dto';
import { formatSubscriberInfoResponse } from '../../helpers';

@Injectable()
export class SubscribersGetInfoService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    private readonly adminPersonsService: AdminPersonsService,
  ) {}

  async execute(
    subscriberId: string,
    service?: CodeService,
  ): Promise<SubscriberInfoResponseDto> {
    const queryBuilder =
      this.subscriberRepository.createQueryBuilder('subscriber');

    queryBuilder
      .leftJoinAndSelect(
        'subscriber.subscriptionsBussine',
        'subscriptionsBussine',
      )
      .leftJoinAndSelect('subscriptionsBussine.subscription', 'subscription')
      .leftJoinAndSelect(
        'subscriptionsBussine.subscriptionDetail',
        'subscriptionDetail',
      )
      .leftJoinAndSelect(
        'subscriptionDetail.subscriptionsService',
        'subscriptionsService',
      )
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
      .where('subscriber.subscriberId = :subscriberId', { subscriberId })
      .andWhere('subscribersSubscriptionDetails.isActive = :isActive', {
        isActive: true,
      })
      .andWhere('subscriberRoles.isActive = :roleActive', { roleActive: true });

    if (service)
      queryBuilder.andWhere('subscriptionsService.code = :service', {
        service,
      });

    const subscriber = await queryBuilder.getOne();

    if (!subscriber)
      throw new RpcException({
        message: `El subscriber con id ${subscriberId} no se encuentra registrado`,
        service: SERVICE_NAME,
      });

    const subscriberNaturalPerson =
      await this.adminPersonsService.findOneNaturalPersonById(
        subscriber.naturalPersonId,
      );

    const subscriptionPersonData =
      await this.adminPersonsService.findOneSubscriptionPersonData(
        subscriber.subscriptionsBussine.personId,
      );

    return formatSubscriberInfoResponse(
      subscriber,
      subscriberNaturalPerson,
      subscriptionPersonData,
    );
  }
}
