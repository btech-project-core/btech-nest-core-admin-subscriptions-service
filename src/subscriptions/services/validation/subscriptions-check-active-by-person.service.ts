import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Subscription } from '../../entities/subscription.entity';
import { StatusSubscription } from '../../enums/status-subscription.enum';

@Injectable()
export class SubscriptionsCheckActiveByPersonService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
  ) {}

  async execute(personId: string): Promise<boolean> {
    const activeSubscriptionsCount = await this.subscriptionsRepository.count({
      where: {
        personId,
        status: StatusSubscription.ACTIVE,
      },
    });
    if (activeSubscriptionsCount > 0)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `No se puede proceder porque la persona tiene ${activeSubscriptionsCount} suscripción(es) activa(s)`,
      });
    return true;
  }
}
