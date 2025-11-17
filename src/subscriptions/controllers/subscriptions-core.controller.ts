import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { FindAllSubscriptionDto } from '../dto/find-all-subscription.dto';
import { SubscriptionsCoreService } from '../services/core';

@Controller()
export class SubscriptionsCoreController {
  constructor(
    private readonly subscriptionsCoreService: SubscriptionsCoreService,
  ) {}

  @MessagePattern('subscriptions.create')
  create(@Payload() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsCoreService.create(createSubscriptionDto);
  }

  @MessagePattern('subscriptions.findAll')
  findAll(@Payload() findAllSubscriptionDto: FindAllSubscriptionDto) {
    return this.subscriptionsCoreService.findAll(findAllSubscriptionDto);
  }
}
