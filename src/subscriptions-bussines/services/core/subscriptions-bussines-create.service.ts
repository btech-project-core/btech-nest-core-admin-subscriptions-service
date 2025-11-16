import { Injectable } from '@nestjs/common';
import { CreateSubscriptionsBussineDto } from '../../dto/create-subscriptions-bussine.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { SubscriptionsBussine } from '../../entities/subscriptions-bussine.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { SubscriptionsService } from 'src/subscriptions-services/entities/subscriptions-service.entity';
import { SubscriptionDetailCoreService } from 'src/subscriptions-detail/services/core';

@Injectable()
export class SubscriptionsBussinesCreateService {
  constructor(
    @InjectRepository(SubscriptionsBussine)
    private readonly subscriptionsBussinesRepository: Repository<SubscriptionsBussine>,
    private readonly subscriptionDetailCoreService: SubscriptionDetailCoreService,
  ) {}

  async execute(
    subscription: Subscription,
    createSubscriptionsBussineDto: CreateSubscriptionsBussineDto,
    subscriptionsServices: SubscriptionsService[],
    queryRunner?: QueryRunner,
  ) {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(SubscriptionsBussine)
      : this.subscriptionsBussinesRepository;

    const subscriptionsBussine = repository.create({
      personId: createSubscriptionsBussineDto.personId,
      subscription: subscription,
      numberAccounts: createSubscriptionsBussineDto.subscriptionDetails.length,
    });

    const savedSubscriptionsBussine =
      await repository.save(subscriptionsBussine);

    await this.subscriptionDetailCoreService.create(
      savedSubscriptionsBussine,
      createSubscriptionsBussineDto.subscriptionDetails,
      subscriptionsServices,
      queryRunner,
    );

    return savedSubscriptionsBussine;
  }
}
