import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import {
  FindSubscribersWithNaturalPersonsRequest,
  FindSubscribersWithNaturalPersonsResponseDto,
  PaginationResponseDto,
} from 'src/common/dto';
import {
  SubscribersBulkService,
  SubscribersCreateBulkFromNaturalPersonsService,
} from '../services/bulk';
import {
  FindSubscribersByIdsDto,
  FindSubscribersByIdsResponseDto,
} from '../dto/find-subscribers-by-ids.dto';
import {
  CreateSubscribersBulkFromNaturalPersonsDto,
  CreateSubscribersBulkFromNaturalPersonsResponseDto,
} from '../dto/create-subscribers-bulk-from-natural-persons.dto';

@Controller()
export class SubscribersBulkController {
  constructor(
    private readonly subscribersBulkService: SubscribersBulkService,
    private readonly subscribersCreateBulkFromNaturalPersonsService: SubscribersCreateBulkFromNaturalPersonsService,
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

  @GrpcMethod('SubscribersService', 'FindSubscribersByIds')
  async findSubscribersByIds(
    data: FindSubscribersByIdsDto,
  ): Promise<
    | { simple: { subscribers: FindSubscribersByIdsResponseDto[] } }
    | { paginated: PaginationResponseDto<FindSubscribersByIdsResponseDto> }
  > {
    const result = await this.subscribersBulkService.findSubscribersByIds(data);
    // Si es array simple (sin paginación)
    if (Array.isArray(result)) return { simple: { subscribers: result } };
    // Si es respuesta paginada
    return { paginated: result };
  }

  @GrpcMethod('SubscribersService', 'CreateSubscribersBulkFromNaturalPersons')
  async createSubscribersBulkFromNaturalPersons(
    data: CreateSubscribersBulkFromNaturalPersonsDto,
  ): Promise<CreateSubscribersBulkFromNaturalPersonsResponseDto> {
    return await this.subscribersCreateBulkFromNaturalPersonsService.execute(
      data,
    );
  }
}
