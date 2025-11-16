import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubscriptionsBussinesCustomService } from '../services/custom';

@Controller()
export class SubscriptionsBussinesCustomController {
  constructor(
    private readonly subscriptionsBussinesCustomService: SubscriptionsBussinesCustomService,
  ) {}

  @MessagePattern('subscriptionBussines.getClientPersonIds')
  async getClientPersonIds(): Promise<string[]> {
    return this.subscriptionsBussinesCustomService.getClientPersonIds();
  }

  @MessagePattern(
    'subscriptionBussines.findSubscriptionBussineIdBySubscriptionDetailId',
  )
  async findSubscriptionBussineIdBySubscriptionDetailId(
    @Payload('subscriptionDetailId', ParseUUIDPipe)
    subscriptionDetailId: string,
  ): Promise<string> {
    return await this.subscriptionsBussinesCustomService.findSubscriptionBussineIdBySubscriptionDetailId(
      subscriptionDetailId,
    );
  }
}
