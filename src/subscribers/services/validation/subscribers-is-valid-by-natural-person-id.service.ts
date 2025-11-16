import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Subscriber } from '../../entities';

@Injectable()
export class SubscribersIsValidByNaturalPersonIdService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
  ) {}

  async execute(naturalPersonIds: string[], service: string): Promise<string> {
    const queryBuilder =
      this.subscriberRepository.createQueryBuilder('subscriber');
    queryBuilder
      .innerJoin(
        'subscriber.subscribersSubscriptionDetails',
        'subscribersSubscriptionDetail',
      )
      .innerJoin(
        'subscribersSubscriptionDetail.subscriptionDetail',
        'subscriptionDetail',
      )
      .innerJoin(
        'subscriptionDetail.subscriptionsService',
        'subscriptionsService',
      )
      .where('subscriber.naturalPersonId IN (:...naturalPersonIds)', {
        naturalPersonIds,
      })
      .andWhere('subscriptionsService.code = :service', { service });

    const subscriber = await queryBuilder.getOne();
    if (!subscriber)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `El usuario ingresado no se encuentra registrado`,
      });
    return subscriber.username;
  }
}
