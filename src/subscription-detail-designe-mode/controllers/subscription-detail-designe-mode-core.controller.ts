import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateSubscriptionDetailDesigneModeDto } from '../dto/create-subscription-detail-designe-mode.dto';
import { SubscriptionDetailDesigneMode } from '../entities/subscription-detail-designe-mode.entity';
import { SubscriptionDetailDesigneModeCoreService } from '../services/core';

@Controller()
export class SubscriptionDetailDesigneModeCoreController {
  constructor(
    private readonly subscriptionDetailDesigneModeCoreService: SubscriptionDetailDesigneModeCoreService,
  ) {}

  @MessagePattern('subscription-detail-designe-mode.create')
  async create(
    @Payload() createDto: CreateSubscriptionDetailDesigneModeDto,
  ): Promise<SubscriptionDetailDesigneMode> {
    return await this.subscriptionDetailDesigneModeCoreService.create(
      createDto,
    );
  }

  @MessagePattern('subscription-detail-designe-mode.findAll')
  async findAll(): Promise<SubscriptionDetailDesigneMode[]> {
    return await this.subscriptionDetailDesigneModeCoreService.findAll();
  }

  @MessagePattern('subscription-detail-designe-mode.findOne')
  async findOne(
    @Payload('id') id: string,
  ): Promise<SubscriptionDetailDesigneMode> {
    return await this.subscriptionDetailDesigneModeCoreService.findOne(id);
  }

  @MessagePattern('subscription-detail-designe-mode.delete')
  async delete(@Payload('id') id: string): Promise<{ message: string }> {
    return await this.subscriptionDetailDesigneModeCoreService.delete(id);
  }
}
