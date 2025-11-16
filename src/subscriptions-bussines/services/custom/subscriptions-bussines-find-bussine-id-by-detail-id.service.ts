import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { SubscriptionsBussine } from '../../entities/subscriptions-bussine.entity';

@Injectable()
export class SubscriptionsBussinesFindBussineIdByDetailIdService {
  constructor(
    @InjectRepository(SubscriptionsBussine)
    private readonly subscriptionsBussinesRepository: Repository<SubscriptionsBussine>,
  ) {}

  async execute(subscriptionDetailId: string): Promise<string> {
    const result = await this.subscriptionsBussinesRepository
      .createQueryBuilder('subscriptionBussine')
      .innerJoin('subscriptionBussine.subscriptionDetail', 'subscriptionDetail')
      .select('subscriptionBussine.subscriptionBussineId')
      .where(
        'subscriptionDetail.subscriptionDetailId = :subscriptionDetailId',
        {
          subscriptionDetailId: subscriptionDetailId.trim(),
        },
      )
      .getOne();
    if (!result)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `No se encontró el negocio de suscripción para el detalle de suscripción: ${subscriptionDetailId}`,
      });
    return result.subscriptionBussineId;
  }
}
