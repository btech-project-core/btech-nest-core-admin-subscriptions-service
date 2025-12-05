import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateSubscriberRequest,
  UpdateUserRequest,
  UserProfileResponseDto,
  DeleteSubscriberRequest,
} from 'src/common/dto';
import { CreateSubscriberDto, CreateSubscriberResponseDto } from '../dto';
import { SubscribersCoreService } from '../services/core';

@Controller()
export class SubscribersCoreController {
  constructor(
    private readonly subscribersCoreService: SubscribersCoreService,
  ) {}

  @MessagePattern('subscribers.create')
  async create(
    @Payload() createSubscriberDto: CreateSubscriberDto,
  ): Promise<CreateSubscriberResponseDto> {
    return await this.subscribersCoreService.create(createSubscriberDto);
  }

  @MessagePattern('subscribers.remove')
  async delete(
    @Payload('subscriberId') subscriberId: string,
  ): Promise<{ message: string }> {
    return await this.subscribersCoreService.delete(subscriberId);
  }

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
