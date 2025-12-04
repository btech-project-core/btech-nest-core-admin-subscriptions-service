import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubscribersSubscriptionDetailCustomService } from '../services/custom';
import {
  AssignSubscriberToServiceDto,
  AssignSubscriberToServiceResponseDto,
} from '../dto/assign-subscriber-to-service.dto';

@Controller()
export class SubscribersSubscriptionDetailCustomController {
  constructor(
    private readonly subscribersSubscriptionDetailCustomService: SubscribersSubscriptionDetailCustomService,
  ) {}

  @MessagePattern('subscribers-subscription-detail.assignToService')
  async assignToService(
    @Payload() data: AssignSubscriberToServiceDto,
  ): Promise<AssignSubscriberToServiceResponseDto> {
    return this.subscribersSubscriptionDetailCustomService.assignToService(
      data,
    );
  }
}
