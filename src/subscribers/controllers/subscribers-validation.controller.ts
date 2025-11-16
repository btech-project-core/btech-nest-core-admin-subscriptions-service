import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import {
  ValidateSubscriberAlertLevelRequest,
  ValidateSubscriberAlertLevelResponseDto,
} from 'src/common/dto';
import { SubscribersValidationService } from '../services/validation';

@Controller()
export class SubscribersValidationController {
  constructor(
    private readonly subscribersValidationService: SubscribersValidationService,
  ) {}

  @MessagePattern('subscribers.checkActiveSubscriptionsByNaturalPersonId')
  checkActiveSubscriptionsByNaturalPersonId(
    @Payload('naturalPersonId', ParseUUIDPipe) naturalPersonId: string,
  ): Promise<boolean> {
    return this.subscribersValidationService.checkActiveSubscriptionsByNaturalPersonId(
      naturalPersonId,
    );
  }

  @GrpcMethod('SubscribersService', 'ValidateSubscriberAlertLevel')
  async validateSubscriberAlertLevel(
    data: ValidateSubscriberAlertLevelRequest,
  ): Promise<ValidateSubscriberAlertLevelResponseDto> {
    const result =
      await this.subscribersValidationService.validateSubscriberAlertLevel(
        data.subscriberIds,
        data.levelAlertCode,
      );
    return { data: result };
  }
}
