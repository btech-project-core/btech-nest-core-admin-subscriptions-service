import { Injectable } from '@nestjs/common';
import { SubscriptionsTypeCreateService } from './subscriptions-type-create.service';
import { SubscriptionsTypeFindAllService } from './subscriptions-type-find-all.service';
import { SubscriptionsTypeFindOneService } from './subscriptions-type-find-one.service';
import { SubscriptionsTypeUpdateService } from './subscriptions-type-update.service';
import { SubscriptionsTypeUpdateStatusService } from './subscriptions-type-update-status.service';
import {
  CreateSubscriptionsTypeDto,
  CreateSubscriptionsTypeResponseDto,
} from 'src/subscriptions-type/dto/create-subscriptions-type.dto';
import {
  FindAllSubscriptionsTypeDto,
  FindAllSubscriptionsTypeResponseDto,
} from 'src/subscriptions-type/dto/find-all-subscriptions-type.dto';
import { PaginationResponseDto } from 'src/common/dto';
import { FindOneSubscriptionsTypeResponseDto } from 'src/subscriptions-type/dto/find-one-subscriptions-type.dto';
import {
  UpdateSubscriptionsTypeDto,
  UpdateSubscriptionsTypeResponseDto,
} from 'src/subscriptions-type/dto/update-subscriptions-type.dto';
import {
  UpdateSubscriptionsTypeStatusDto,
  UpdateSubscriptionsTypeStatusResponseDto,
} from 'src/subscriptions-type/dto/update-subscriptions-type-status.dto';

@Injectable()
export class SubscriptionsTypeCoreService {
  constructor(
    private readonly subscriptionsTypeCreateService: SubscriptionsTypeCreateService,
    private readonly subscriptionsTypeFindAllService: SubscriptionsTypeFindAllService,
    private readonly subscriptionsTypeFindOneService: SubscriptionsTypeFindOneService,
    private readonly subscriptionsTypeUpdateService: SubscriptionsTypeUpdateService,
    private readonly subscriptionsTypeUpdateStatusService: SubscriptionsTypeUpdateStatusService,
  ) {}
  async create(
    createSubscriptionsTypeDto: CreateSubscriptionsTypeDto,
  ): Promise<CreateSubscriptionsTypeResponseDto> {
    return await this.subscriptionsTypeCreateService.execute(
      createSubscriptionsTypeDto,
    );
  }

  async findAll(
    findAllSubscriptionsTypeDto: FindAllSubscriptionsTypeDto,
  ): Promise<
    | FindAllSubscriptionsTypeResponseDto[]
    | PaginationResponseDto<FindAllSubscriptionsTypeResponseDto>
  > {
    return await this.subscriptionsTypeFindAllService.execute(
      findAllSubscriptionsTypeDto,
    );
  }

  async findOne(
    subscriptionTypeId: string,
  ): Promise<FindOneSubscriptionsTypeResponseDto> {
    return await this.subscriptionsTypeFindOneService.execute(
      subscriptionTypeId,
    );
  }

  async update(
    updateSubscriptionsTypeDto: UpdateSubscriptionsTypeDto,
  ): Promise<UpdateSubscriptionsTypeResponseDto> {
    return await this.subscriptionsTypeUpdateService.execute(
      updateSubscriptionsTypeDto,
    );
  }

  async updateStatus(
    updateSubscriptionsTypeStatusDto: UpdateSubscriptionsTypeStatusDto,
  ): Promise<UpdateSubscriptionsTypeStatusResponseDto> {
    return await this.subscriptionsTypeUpdateStatusService.updateStatus(
      updateSubscriptionsTypeStatusDto,
    );
  }
}
