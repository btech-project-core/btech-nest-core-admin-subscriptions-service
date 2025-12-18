import { Injectable } from '@nestjs/common';
import {
  CreateSubscriberDto,
  CreateSubscriberResponseDto,
} from '../../dto/create-subscriber.dto';
import { SubscribersCreateService } from './subscribers-create.service';
import { SubscribersUpdateService } from './subscribers-update.service';
import { SubscribersDeleteService } from './subscribers-delete.service';
import { SubscribersFindAllService } from './subscribers-find-all.service';
import {
  FindAllSubscriberDto,
  FindAllSubscriberResponseDto,
} from '../../dto/find-all-subscriber.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import {
  UpdateSubscriberDto,
  UpdateSubscriberResponseDto,
} from '../../dto/update-subscriber.dto';
import { SubscribersFindOneService } from './subscribers-find-one.service';
import { Subscriber } from 'src/subscribers/entities';

@Injectable()
export class SubscribersCoreService {
  constructor(
    private readonly subscribersCreateService: SubscribersCreateService,
    private readonly subscribersUpdateService: SubscribersUpdateService,
    private readonly subscribersDeleteService: SubscribersDeleteService,
    private readonly subscribersFindAllService: SubscribersFindAllService,
    private readonly subscribersFindOneService: SubscribersFindOneService,
  ) {}

  async create(
    createSubscriberDto: CreateSubscriberDto,
  ): Promise<CreateSubscriberResponseDto> {
    return await this.subscribersCreateService.execute(createSubscriberDto);
  }

  async findAll(
    findAllSubscriberDto: FindAllSubscriberDto,
  ): Promise<
    | FindAllSubscriberResponseDto[]
    | PaginationResponseDto<FindAllSubscriberResponseDto>
  > {
    return await this.subscribersFindAllService.execute(findAllSubscriberDto);
  }

  async findOne(subscriberId: string): Promise<Subscriber> {
    return await this.subscribersFindOneService.execute(subscriberId);
  }

  async update(
    updateData: UpdateSubscriberDto,
  ): Promise<UpdateSubscriberResponseDto> {
    return await this.subscribersUpdateService.execute(updateData);
  }

  async delete(subscriberId: string): Promise<{ message: string }> {
    return await this.subscribersDeleteService.execute(subscriberId);
  }
}
