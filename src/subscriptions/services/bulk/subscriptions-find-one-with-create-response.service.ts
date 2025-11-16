import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../../entities/subscription.entity';
import { RpcException } from '@nestjs/microservices';
import { FindAllSubscriptionResponseDto } from '../../dto/find-all-subscription.dto';
import { SubscriptionsFormatBussinesWithPersonDataService } from './subscriptions-format-bussines-with-person-data.service';

@Injectable()
export class SubscriptionsFindOneWithCreateResponseService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
    private readonly subscriptionsFormatBussinesWithPersonDataService: SubscriptionsFormatBussinesWithPersonDataService,
  ) {}

  async execute(
    subscriptionId: string,
  ): Promise<FindAllSubscriptionResponseDto[]> {
    const createdSubscription = await this.subscriptionsRepository
      .createQueryBuilder('subscription')
      .leftJoinAndSelect(
        'subscription.subscriptionsBussine',
        'subscriptionsBussine',
      )
      .where('subscription.subscriptionId = :subscriptionId', {
        subscriptionId,
      })
      .getOne();

    if (!createdSubscription)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'No se ha encontrado la suscripción',
      });

    const subscriptionsBussineList = (
      createdSubscription.subscriptionsBussine || []
    ).map((subscriptionBussine) => {
      subscriptionBussine.subscription = createdSubscription;
      return subscriptionBussine;
    });

    return await this.subscriptionsFormatBussinesWithPersonDataService.execute(
      subscriptionsBussineList,
    );
  }
}
