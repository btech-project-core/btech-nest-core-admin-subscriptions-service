import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  UpdateSubscriptionFeaturesStatusDto,
  UpdateSubscriptionFeaturesStatusResponseDto,
} from '../../dto/update-subscription-features-status.dto';
import { SubscriptionFeatures } from '../../entities/subscription-features.entity';
import { SubscriptionsFeaturesFindOneService } from './subscriptions-features-find-one.service';
import { SubscriptionsFeaturesCustomService } from '../custom/subscriptions-features-custom.service';

@Injectable()
export class SubscriptionsFeaturesUpdateStatusService {
  constructor(
    @InjectRepository(SubscriptionFeatures)
    private readonly subscriptionFeaturesRepository: Repository<SubscriptionFeatures>,
    private readonly subscriptionsFeaturesFindOneService: SubscriptionsFeaturesFindOneService,
    private readonly subscriptionsFeaturesCustomService: SubscriptionsFeaturesCustomService,
  ) {}

  async execute(
    updateSubscriptionFeaturesStatusDto: UpdateSubscriptionFeaturesStatusDto,
  ): Promise<UpdateSubscriptionFeaturesStatusResponseDto> {
    const { subscriptionFeaturesId, isActive, subscriptionDetailId } =
      updateSubscriptionFeaturesStatusDto;
    const existingSubscriptionFeatures =
      await this.subscriptionsFeaturesFindOneService.execute(
        subscriptionFeaturesId,
        subscriptionDetailId,
      );
    if (!isActive)
      await this.subscriptionsFeaturesCustomService.relatedSubscriptionDetails(
        subscriptionFeaturesId,
      );
    await this.subscriptionFeaturesRepository.update(subscriptionFeaturesId, {
      isActive,
    });
    const statusMessage = isActive ? 'activada' : 'desactivada';
    return {
      message: `Característica '${existingSubscriptionFeatures.description}' ${statusMessage} exitosamente`,
    };
  }
}
