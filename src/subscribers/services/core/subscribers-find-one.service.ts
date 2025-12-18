import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Subscriber } from '../../entities/subscriber.entity';
import { StatusSubscription } from 'src/subscriptions/enums';

@Injectable()
export class SubscribersFindOneService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
  ) {}

  async execute(subscriberId: string): Promise<Subscriber> {
    const queryBuilder =
      this.subscriberRepository.createQueryBuilder('subscriber');
    queryBuilder
      .leftJoinAndSelect(
        'subscriber.subscriptionsBussine',
        'subscriptionsBussine',
      )
      .leftJoinAndSelect('subscriptionsBussine.subscription', 'subscription')
      .where('subscriber.subscriberId = :subscriberId', { subscriberId })
      .andWhere('subscription.status = :status', {
        status: StatusSubscription.ACTIVE,
      });
    const subscriber = await queryBuilder.getOne();
    if (!subscriber)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `El usuario no se encuentra registrado`,
      });
    if (
      subscriber.subscriptionsBussine.subscription.status !==
      StatusSubscription.ACTIVE
    )
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'El usuario se encuentra sin suscripción activa',
      });
    return subscriber;
  }
}
