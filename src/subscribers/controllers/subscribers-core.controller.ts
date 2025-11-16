import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateSubscriberRequest,
  UpdateUserRequest,
  UserProfileResponseDto,
  DeleteSubscriberRequest,
} from 'src/common/dto';
import { CreateSubscriberResponseDto } from '../dto';
import { SubscribersCoreService } from '../services/core';

@Controller()
export class SubscribersCoreController {
  constructor(
    private readonly subscribersCoreService: SubscribersCoreService,
  ) {}

  @GrpcMethod('SubscribersService', 'RegisterSubscriber')
  async registerSubscriber(
    data: CreateSubscriberRequest,
  ): Promise<CreateSubscriberResponseDto> {
    return this.subscribersCoreService.create(data);
  }

  @GrpcMethod('SubscribersService', 'UpdateUser')
  async updateUser(data: UpdateUserRequest): Promise<UserProfileResponseDto> {
    return this.subscribersCoreService.update(data.subscriberId, data);
  }

  @GrpcMethod('SubscribersService', 'DeleteSubscriber')
  async deleteSubscriber(
    data: DeleteSubscriberRequest,
  ): Promise<{ message: string }> {
    return await this.subscribersCoreService.delete(data.subscriberId);
  }
}
