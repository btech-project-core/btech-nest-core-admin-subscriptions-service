import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateSubscriptionFeaturesDto,
  CreateSubscriptionFeaturesResponseDto,
} from '../../dto/create-subscription-features.dto';
import { formatSubscriptionFeaturesResponse } from '../../helpers/format-subscription-features-response.helper';
import { SubscriptionFeatures } from '../../entities/subscription-features.entity';

@Injectable()
export class SubscriptionsFeaturesCreateService {
  constructor(
    @InjectRepository(SubscriptionFeatures)
    private readonly subscriptionFeaturesRepository: Repository<SubscriptionFeatures>,
  ) {}

  async execute(
    createSubscriptionFeaturesDto: CreateSubscriptionFeaturesDto,
  ): Promise<CreateSubscriptionFeaturesResponseDto> {
    const subscriptionFeatures = this.subscriptionFeaturesRepository.create(
      createSubscriptionFeaturesDto,
    );
    await this.subscriptionFeaturesRepository.save(subscriptionFeatures);
    return formatSubscriptionFeaturesResponse(subscriptionFeatures);
  }
}
