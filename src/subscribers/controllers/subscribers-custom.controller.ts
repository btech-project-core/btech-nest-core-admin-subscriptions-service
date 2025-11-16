import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import {
  FindUserByIdRequest,
  FindUserByUsernameRequest,
  SetPasswordRequest,
  UserProfileResponseDto,
  SubscriberInfoResponseDto,
} from 'src/common/dto';
import {
  FindOneUsernameResponseDto,
  FindOneSubscriberByIdResponseDto,
  FindByNaturalPersonIdResponseDto,
  FindByNaturalPersonIdDto,
} from '../dto';
import { SubscribersCustomService } from '../services/custom';

@Controller()
export class SubscribersCustomController {
  constructor(
    private readonly subscribersCustomService: SubscribersCustomService,
  ) {}

  @GrpcMethod('SubscribersService', 'FindUserByUsername')
  async findUserByUsername(
    data: FindUserByUsernameRequest,
  ): Promise<FindOneUsernameResponseDto> {
    return this.subscribersCustomService.findOneByUsername(
      data.username,
      data.domain,
      data.service,
      data.role,
      data.allowGlobalUser,
    );
  }

  @GrpcMethod('SubscribersService', 'FindUserById')
  async findUserById(
    data: FindUserByIdRequest,
  ): Promise<FindOneSubscriberByIdResponseDto> {
    return this.subscribersCustomService.findOneById(data.subscriberId);
  }

  @MessagePattern('subscribers.findUserProfile')
  async findUserProfileNats(
    @Payload() data: FindUserByIdRequest,
  ): Promise<UserProfileResponseDto | null> {
    return this.subscribersCustomService.findOneBySubscriberIdWithLogin(
      data.subscriberId,
      data.service,
    );
  }

  @GrpcMethod('SubscribersService', 'FindUserProfile')
  async findUserProfile(
    data: FindUserByIdRequest,
  ): Promise<UserProfileResponseDto | null> {
    return this.subscribersCustomService.findOneBySubscriberIdWithLogin(
      data.subscriberId,
      data.service,
    );
  }

  @GrpcMethod('SubscribersService', 'GetSubscriberInfo')
  async getSubscribersInfo(
    data: FindUserByIdRequest,
  ): Promise<SubscriberInfoResponseDto> {
    return this.subscribersCustomService.getInfo(
      data.subscriberId,
      data.service,
    );
  }

  @GrpcMethod('SubscribersService', 'SetPassword')
  async setPassword(
    data: SetPasswordRequest,
  ): Promise<{ success: boolean; message: string }> {
    return this.subscribersCustomService.setPassword(
      data.subscriberId,
      data.hashedPassword,
    );
  }

  @MessagePattern('subscribers.findByNaturalPersonId')
  async findByNaturalPersonId(
    @Payload() data: FindByNaturalPersonIdDto,
  ): Promise<FindByNaturalPersonIdResponseDto> {
    return this.subscribersCustomService.findByNaturalPersonId(
      data.naturalPersonId,
      data.service,
    );
  }

  @MessagePattern('subscribers.deleteSubscribersAlternal')
  async deleteSubscribersAlternal(): Promise<{ message: string }> {
    return this.subscribersCustomService.deleteSubscribersAlternal();
  }
}
