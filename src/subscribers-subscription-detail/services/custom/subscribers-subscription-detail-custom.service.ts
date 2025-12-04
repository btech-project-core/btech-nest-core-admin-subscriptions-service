import { Injectable } from '@nestjs/common';
import { SubscribersSubscriptionDetailAssignToServiceService } from './subscribers-subscription-detail-assign-to-service.service';
import {
  AssignSubscriberToServiceDto,
  AssignSubscriberToServiceResponseDto,
} from '../../dto/assign-subscriber-to-service.dto';

@Injectable()
export class SubscribersSubscriptionDetailCustomService {
  constructor(
    private readonly assignToServiceService: SubscribersSubscriptionDetailAssignToServiceService,
  ) {}

  async assignToService(
    dto: AssignSubscriberToServiceDto,
  ): Promise<AssignSubscriberToServiceResponseDto> {
    return this.assignToServiceService.execute(dto);
  }
}
