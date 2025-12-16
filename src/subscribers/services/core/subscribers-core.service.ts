import { Injectable } from '@nestjs/common';
import {
  CreateSubscriberDto,
  CreateSubscriberResponseDto,
} from '../../dto/create-subscriber.dto';
import { UserProfileResponseDto } from 'src/common/dto/user-profile.dto';
import { Subscriber } from '../../entities/subscriber.entity';
import { SubscribersCreateService } from './subscribers-create.service';
import { SubscribersUpdateService } from './subscribers-update.service';
import { SubscribersDeleteService } from './subscribers-delete.service';
import { SubscribersFindAllService } from './subscribers-find-all.service';
import {
  FindAllSubscriberDto,
  FindAllSubscriberResponseDto,
} from '../../dto/find-all-subscriber.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class SubscribersCoreService {
  constructor(
    private readonly subscribersCreateService: SubscribersCreateService,
    private readonly subscribersUpdateService: SubscribersUpdateService,
    private readonly subscribersDeleteService: SubscribersDeleteService,
    private readonly subscribersFindAllService: SubscribersFindAllService,
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

  async update(
    subscriberId: string,
    updateData: Partial<Subscriber>,
  ): Promise<UserProfileResponseDto> {
    return await this.subscribersUpdateService.execute(
      subscriberId,
      updateData,
    );
  }

  async delete(subscriberId: string): Promise<{ message: string }> {
    return await this.subscribersDeleteService.execute(subscriberId);
  }
}
