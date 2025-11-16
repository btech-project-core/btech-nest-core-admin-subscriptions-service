import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriberDesignePreference } from '../../entities/subscriber-designe-preference.entity';
import {
  CreateOrUpdateSubscriberDesignePreferenceDto,
  CreateOrUpdateSubscriberDesignePreferenceResponseDto,
} from '../../dto/create-or-update-subscriber-designe-preference.dto';
import { SubscriberDesignePreferenceValidationService } from '../validation/subscriber-designe-preference-validation.service';
import { formatSubscriberDesignePreferenceResponse } from '../../helpers/format-subscriber-designe-preference-response.helper';
import { SubscribersValidationService } from 'src/subscribers/services/validation';

@Injectable()
export class SubscriberDesignePreferenceCreateOrUpdateService {
  constructor(
    @InjectRepository(SubscriberDesignePreference)
    private readonly subscriberDesignePreferenceRepository: Repository<SubscriberDesignePreference>,
    private readonly subscriberDesignePreferenceValidationService: SubscriberDesignePreferenceValidationService,
    private readonly subscribersValidationService: SubscribersValidationService,
  ) {}

  async execute(
    createOrUpdateDto: CreateOrUpdateSubscriberDesignePreferenceDto,
  ): Promise<CreateOrUpdateSubscriberDesignePreferenceResponseDto> {
    const { subscriberId, subscriptionDetailDesigneModeId } = createOrUpdateDto;
    // Validate subscriber exists
    await this.subscribersValidationService.validateExists(subscriberId);
    // Validate subscription detail designe mode exists
    const subscriptionDetailDesigneMode =
      await this.subscriberDesignePreferenceValidationService.validateSubscriptionDetailDesigneModeExists(
        subscriptionDetailDesigneModeId,
      );
    // Check if subscriber already has a preference
    let subscriberDesignePreference =
      await this.subscriberDesignePreferenceValidationService.validateDetails(
        subscriberId,
      );
    if (subscriberDesignePreference) {
      // Update existing preference
      subscriberDesignePreference.subscriptionDetailDesigneMode =
        subscriptionDetailDesigneMode;
      await this.subscriberDesignePreferenceRepository.save(
        subscriberDesignePreference,
      );
    } else {
      // Create new preference
      subscriberDesignePreference =
        this.subscriberDesignePreferenceRepository.create({
          subscriber: { subscriberId },
          subscriptionDetailDesigneMode: { subscriptionDetailDesigneModeId },
        });
      await this.subscriberDesignePreferenceRepository.save(
        subscriberDesignePreference,
      );
      // Reload with relations
      subscriberDesignePreference =
        await this.subscriberDesignePreferenceValidationService.validateDetails(
          subscriberId,
        );
    }
    return formatSubscriberDesignePreferenceResponse(
      subscriberDesignePreference!,
    );
  }
}
