import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { SubscriptionsType } from 'src/subscriptions-type/entities/subscriptions-type.entity';

@Injectable()
export class SubscriptionsTypeRelatedSubscriptionsService {
  constructor(
    @InjectRepository(SubscriptionsType)
    private readonly subscriptionsTypeRepository: Repository<SubscriptionsType>,
  ) {}

  async execute(subscriptionTypeId: string): Promise<void> {
    const relatedSubscriptionsCount = await this.subscriptionsTypeRepository
      .createQueryBuilder('subscriptionsType')
      .innerJoin('subscriptionsType.subscriptions', 'subscription')
      .where('subscriptionsType.subscriptionTypeId = :subscriptionTypeId', {
        subscriptionTypeId,
      })
      .andWhere('subscription.isActive = true')
      .andWhere('subscriptionsType.isActive = true')
      .getCount();

    if (relatedSubscriptionsCount > 0)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message:
          'No se puede desactivar el tipo de suscripción porque tiene suscripciones asociadas',
      });
  }
}
