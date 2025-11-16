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

@Injectable()
export class SubscribersCoreService {
  constructor(
    private readonly subscribersCreateService: SubscribersCreateService,
    private readonly subscribersUpdateService: SubscribersUpdateService,
    private readonly subscribersDeleteService: SubscribersDeleteService,
  ) {}

  async create(
    createSubscriberDto: CreateSubscriberDto,
  ): Promise<CreateSubscriberResponseDto> {
    return await this.subscribersCreateService.execute(createSubscriberDto);
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
