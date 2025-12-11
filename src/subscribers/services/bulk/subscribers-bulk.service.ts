import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { Subscriber } from '../../entities';
import {
  FindSubscribersWithNaturalPersonsDto,
  SubscriberWithNaturalPersonDto,
} from '../../dto';
import { PaginationResponseDto } from 'src/common/dto';
import { SubscriptionsBussine } from 'src/subscriptions-bussines/entities';
import { SubscribersFindWithNaturalPersonsService } from './subscribers-find-with-natural-persons.service';
import { SubscribersGetCountByDetailService } from './subscribers-get-count-by-detail.service';
import { SubscribersCreateForNaturalPersonsService } from './subscribers-create-for-natural-persons.service';
import { SubscriptionDetail } from 'src/subscriptions-detail/entities/subscription-detail.entity';
import { SubscribersFindByIdsService } from './subscribers-find-by-ids.service';
import {
  FindSubscribersByIdsDto,
  FindSubscribersByIdsResponseDto,
} from '../../dto/find-subscribers-by-ids.dto';

@Injectable()
export class SubscribersBulkService {
  constructor(
    private readonly subscribersFindWithNaturalPersonsService: SubscribersFindWithNaturalPersonsService,
    private readonly subscribersGetCountByDetailService: SubscribersGetCountByDetailService,
    private readonly subscribersCreateForNaturalPersonsService: SubscribersCreateForNaturalPersonsService,
    private readonly subscribersFindByIdsService: SubscribersFindByIdsService,
  ) {}

  async findSubscribersWithNaturalPersons(
    findDto: FindSubscribersWithNaturalPersonsDto,
  ): Promise<PaginationResponseDto<SubscriberWithNaturalPersonDto>> {
    return this.subscribersFindWithNaturalPersonsService.execute(findDto);
  }

  invalidateCountCache(subscriptionDetailId: string): void {
    this.subscribersFindWithNaturalPersonsService.invalidateCountCache(
      subscriptionDetailId,
    );
  }

  async getNaturalPersonIdsBySubscriptionDetail(
    subscriptionDetailId: string,
  ): Promise<string[]> {
    return this.subscribersGetCountByDetailService.execute(
      subscriptionDetailId,
    );
  }

  async createSubscribersForNaturalPersons(
    naturalPersons: { naturalPersonId: string; documentNumber: string }[],
    subscriptionsBussine: SubscriptionsBussine,
    subscriptionDetails: SubscriptionDetail[],
    queryRunner?: QueryRunner,
  ): Promise<Subscriber[]> {
    return this.subscribersCreateForNaturalPersonsService.execute(
      naturalPersons,
      subscriptionsBussine,
      subscriptionDetails,
      queryRunner,
    );
  }

  async findSubscribersByIds(
    findSubscribersByIdsDto: FindSubscribersByIdsDto,
  ): Promise<FindSubscribersByIdsResponseDto[]> {
    return this.subscribersFindByIdsService.execute(findSubscribersByIdsDto);
  }
}
