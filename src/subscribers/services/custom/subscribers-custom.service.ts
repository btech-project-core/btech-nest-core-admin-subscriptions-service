import { Injectable } from '@nestjs/common';
import { FindByNaturalPersonIdResponseDto } from '../../dto';
import { FindOneSubscriberByIdResponseDto } from '../../dto';
import { FindOneUsernameResponseDto } from '../../dto';
import { CodeService } from 'src/common/enums';
import {
  SubscriberInfoResponseDto,
  UserProfileResponseDto,
} from 'src/common/dto';
import { Subscriber } from '../../entities';
import { SubscribersFindByNaturalPersonIdService } from './subscribers-find-by-natural-person-id.service';
import { SubscribersFindOneByIdService } from './subscribers-find-one-by-id.service';
import { SubscribersFindOneByUsernameService } from './subscribers-find-one-by-username.service';
import { SubscribersFindOneByIdWithLoginService } from './subscribers-find-one-by-id-with-login.service';
import { SubscribersGetInfoService } from './subscribers-get-info.service';
import { SubscribersQueryByUsernameService } from './subscribers-query-by-username.service';
import { SubscribersQueryGlobalByUsernameService } from './subscribers-query-global-by-username.service';
import { SubscribersSetPasswordService } from './subscribers-set-password.service';
import { SubscribersDeleteAlternalService } from './subscribers-delete-alternal.service';

@Injectable()
export class SubscribersCustomService {
  constructor(
    private readonly subscribersFindByNaturalPersonIdService: SubscribersFindByNaturalPersonIdService,
    private readonly subscribersFindOneByIdService: SubscribersFindOneByIdService,
    private readonly subscribersFindOneByUsernameService: SubscribersFindOneByUsernameService,
    private readonly subscribersFindOneByIdWithLoginService: SubscribersFindOneByIdWithLoginService,
    private readonly subscribersGetInfoService: SubscribersGetInfoService,
    private readonly subscribersQueryByUsernameService: SubscribersQueryByUsernameService,
    private readonly subscribersQueryGlobalByUsernameService: SubscribersQueryGlobalByUsernameService,
    private readonly subscribersSetPasswordService: SubscribersSetPasswordService,
    private readonly subscribersDeleteAlternalService: SubscribersDeleteAlternalService,
  ) {}

  async findByNaturalPersonId(
    naturalPersonId: string,
    service: CodeService,
  ): Promise<FindByNaturalPersonIdResponseDto> {
    return this.subscribersFindByNaturalPersonIdService.execute(
      naturalPersonId,
      service,
    );
  }

  async findOneById(
    subscriberId: string,
  ): Promise<FindOneSubscriberByIdResponseDto> {
    return this.subscribersFindOneByIdService.execute(subscriberId);
  }

  async findOneByUsername(
    username: string,
    domain: string,
    service: CodeService,
    role?: string,
    allowGlobalUser: boolean = true,
  ): Promise<FindOneUsernameResponseDto> {
    return this.subscribersFindOneByUsernameService.execute(
      username,
      domain,
      service,
      role,
      allowGlobalUser,
    );
  }

  async findOneBySubscriberIdWithLogin(
    subscriberId: string,
    service?: CodeService,
  ): Promise<UserProfileResponseDto | null> {
    return this.subscribersFindOneByIdWithLoginService.execute(
      subscriberId,
      service,
    );
  }

  async getInfo(
    subscriberId: string,
    service?: CodeService,
  ): Promise<SubscriberInfoResponseDto> {
    return this.subscribersGetInfoService.execute(subscriberId, service);
  }

  async querySubscriberByUsername(
    username: string,
    domain: string,
    service: CodeService,
  ): Promise<Subscriber | null> {
    return this.subscribersQueryByUsernameService.execute(
      username,
      domain,
      service,
    );
  }

  async queryGlobalSubscriberByUsername(
    username: string,
  ): Promise<Subscriber | null> {
    return this.subscribersQueryGlobalByUsernameService.execute(username);
  }

  async setPassword(
    subscriberId: string,
    hashedPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.subscribersSetPasswordService.execute(
      subscriberId,
      hashedPassword,
    );
  }

  async deleteSubscribersAlternal(): Promise<{ message: string }> {
    return this.subscribersDeleteAlternalService.execute();
  }
}
