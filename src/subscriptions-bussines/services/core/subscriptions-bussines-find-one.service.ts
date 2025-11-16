import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { SubscriptionsBussine } from '../../entities/subscriptions-bussine.entity';

@Injectable()
export class SubscriptionsBussinesFindOneService {
  constructor(
    @InjectRepository(SubscriptionsBussine)
    private readonly subscriptionsBussinesRepository: Repository<SubscriptionsBussine>,
  ) {}

  async execute(subscriptionBussineId: string): Promise<SubscriptionsBussine> {
    const subscriptionsBussine =
      await this.subscriptionsBussinesRepository.findOne({
        where: { subscriptionBussineId: subscriptionBussineId.trim() },
      });
    if (!subscriptionsBussine)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `No se encontró la suscripción bussines con id: ${subscriptionBussineId}`,
      });
    return subscriptionsBussine;
  }
}
