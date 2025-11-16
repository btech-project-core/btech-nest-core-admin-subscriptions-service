import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  UpdateSubscriptionFeaturesDto,
  UpdateSubscriptionFeaturesResponseDto,
} from '../../dto/update-subscription-features.dto';
import { formatSubscriptionFeaturesResponse } from '../../helpers/format-subscription-features-response.helper';
import { SubscriptionFeatures } from '../../entities/subscription-features.entity';
import { SubscriptionsFeaturesFindOneService } from './subscriptions-features-find-one.service';

@Injectable()
export class SubscriptionsFeaturesUpdateService {
  constructor(
    @InjectRepository(SubscriptionFeatures)
    private readonly subscriptionFeaturesRepository: Repository<SubscriptionFeatures>,
    private readonly subscriptionsFeaturesFindOneService: SubscriptionsFeaturesFindOneService,
  ) {}

  async execute(
    updateSubscriptionFeaturesDto: UpdateSubscriptionFeaturesDto,
  ): Promise<UpdateSubscriptionFeaturesResponseDto> {
    const {
      subscriptionFeaturesId,
      code,
      description,
      isRequired,
      subscriptionDetailId,
    } = updateSubscriptionFeaturesDto;
    const subscriptionFeatures =
      await this.subscriptionsFeaturesFindOneService.execute(
        subscriptionFeaturesId,
        subscriptionDetailId!,
      );

    subscriptionFeatures.code = code ?? subscriptionFeatures.code;
    subscriptionFeatures.description =
      description ?? subscriptionFeatures.description;
    subscriptionFeatures.isRequired =
      isRequired ?? subscriptionFeatures.isRequired;

    await this.subscriptionFeaturesRepository.save(subscriptionFeatures);
    return formatSubscriptionFeaturesResponse(subscriptionFeatures);
  }
}
