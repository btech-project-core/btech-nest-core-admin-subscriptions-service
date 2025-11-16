import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import {
  FindSubscribersWithNaturalPersonsRequest,
  FindSubscribersWithNaturalPersonsResponseDto,
} from 'src/common/dto';
import { SubscribersBulkService } from '../services/bulk';

@Controller()
export class SubscribersBulkController {
  constructor(
    private readonly subscribersBulkService: SubscribersBulkService,
  ) {}

  @GrpcMethod('SubscribersService', 'FindSubscribersWithNaturalPersons')
  async findSubscribersWithNaturalPersons(
    data: FindSubscribersWithNaturalPersonsRequest,
  ): Promise<FindSubscribersWithNaturalPersonsResponseDto> {
    return this.subscribersBulkService.findSubscribersWithNaturalPersons({
      subscriptionDetailId: data.subscriptionDetailId,
      page: data.page,
      limit: data.limit,
      term: data.term,
      subscriberIds: data.subscriberIds,
    });
  }

  @MessagePattern('subscribers.getNaturalPersonIdsBySubscriptionDetail')
  async getNaturalPersonIdsBySubscriptionDetail(
    @Payload('subscriptionDetailId', ParseUUIDPipe)
    subscriptionDetailId: string,
  ): Promise<string[]> {
    return this.subscribersBulkService.getNaturalPersonIdsBySubscriptionDetail(
      subscriptionDetailId,
    );
  }
}
