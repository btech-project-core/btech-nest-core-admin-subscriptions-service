import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionsType } from 'src/subscriptions-type/entities/subscriptions-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionsTypeFindOneService {
  constructor(
    @InjectRepository(SubscriptionsType)
    private readonly subscriptionsTypeRepository: Repository<SubscriptionsType>,
  ) {}
  async execute(subscriptionTypeId: string): Promise<SubscriptionsType> {
    const subscriptionsType = await this.subscriptionsTypeRepository.findOne({
      where: { subscriptionTypeId: subscriptionTypeId.trim() },
    });
    if (!subscriptionsType)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Tipo de suscripción con ID '${subscriptionTypeId}' no encontrado`,
      });
    return subscriptionsType;
  }
}
