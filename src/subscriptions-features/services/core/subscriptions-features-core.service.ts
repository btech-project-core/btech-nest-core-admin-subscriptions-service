import { Injectable } from '@nestjs/common';
import {
  CreateSubscriptionFeaturesDto,
  CreateSubscriptionFeaturesResponseDto,
} from '../../dto/create-subscription-features.dto';
import {
  UpdateSubscriptionFeaturesDto,
  UpdateSubscriptionFeaturesResponseDto,
} from '../../dto/update-subscription-features.dto';
import {
  FindAllSubscriptionFeaturesDto,
  FindAllSubscriptionFeaturesResponseDto,
} from '../../dto/find-all-subscription-features.dto';
import {
  UpdateSubscriptionFeaturesStatusDto,
  UpdateSubscriptionFeaturesStatusResponseDto,
} from '../../dto/update-subscription-features-status.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import { SubscriptionFeatures } from '../../entities/subscription-features.entity';
import { SubscriptionsFeaturesCreateService } from './subscriptions-features-create.service';
import { SubscriptionsFeaturesFindAllService } from './subscriptions-features-find-all.service';
import { SubscriptionsFeaturesFindOneService } from './subscriptions-features-find-one.service';
import { SubscriptionsFeaturesUpdateService } from './subscriptions-features-update.service';
import { SubscriptionsFeaturesUpdateStatusService } from './subscriptions-features-update-status.service';

@Injectable()
export class SubscriptionsFeaturesCoreService {
  constructor(
    private readonly subscriptionsFeaturesCreateService: SubscriptionsFeaturesCreateService,
    private readonly subscriptionsFeaturesFindAllService: SubscriptionsFeaturesFindAllService,
    private readonly subscriptionsFeaturesFindOneService: SubscriptionsFeaturesFindOneService,
    private readonly subscriptionsFeaturesUpdateService: SubscriptionsFeaturesUpdateService,
    private readonly subscriptionsFeaturesUpdateStatusService: SubscriptionsFeaturesUpdateStatusService,
  ) {}

  async create(
    createSubscriptionFeaturesDto: CreateSubscriptionFeaturesDto,
  ): Promise<CreateSubscriptionFeaturesResponseDto> {
    return await this.subscriptionsFeaturesCreateService.execute(
      createSubscriptionFeaturesDto,
    );
  }

  async findAll(
    findAllSubscriptionFeaturesDto: FindAllSubscriptionFeaturesDto,
  ): Promise<
    | FindAllSubscriptionFeaturesResponseDto[]
    | PaginationResponseDto<FindAllSubscriptionFeaturesResponseDto>
  > {
    return await this.subscriptionsFeaturesFindAllService.execute(
      findAllSubscriptionFeaturesDto,
    );
  }

  async findOne(
    subscriptionFeaturesId: string,
    subscriptionDetailId: string,
  ): Promise<SubscriptionFeatures> {
    return await this.subscriptionsFeaturesFindOneService.execute(
      subscriptionFeaturesId,
      subscriptionDetailId,
    );
  }

  async update(
    updateSubscriptionFeaturesDto: UpdateSubscriptionFeaturesDto,
  ): Promise<UpdateSubscriptionFeaturesResponseDto> {
    return await this.subscriptionsFeaturesUpdateService.execute(
      updateSubscriptionFeaturesDto,
    );
  }

  async updateStatus(
    updateSubscriptionFeaturesStatusDto: UpdateSubscriptionFeaturesStatusDto,
  ): Promise<UpdateSubscriptionFeaturesStatusResponseDto> {
    return await this.subscriptionsFeaturesUpdateStatusService.execute(
      updateSubscriptionFeaturesStatusDto,
    );
  }
}
