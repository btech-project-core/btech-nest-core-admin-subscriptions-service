import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { SubscriptionDetail } from '../../entities/subscription-detail.entity';

@Injectable()
export class SubscriptionDetailFindWithBusinessService {
  constructor(
    @InjectRepository(SubscriptionDetail)
    private readonly subscriptionDetailRepository: Repository<SubscriptionDetail>,
  ) {}

  async execute(subscriptionDetailId: string): Promise<SubscriptionDetail> {
    const subscriptionDetail =
      await this.subscriptionDetailRepository.findOne({
        where: { subscriptionDetailId: subscriptionDetailId.trim() },
        relations: ['subscriptionsBussine'],
      });

    if (!subscriptionDetail) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Detalle de suscripción con ID '${subscriptionDetailId}' no encontrado`,
      });
    }

    return subscriptionDetail;
  }
}
