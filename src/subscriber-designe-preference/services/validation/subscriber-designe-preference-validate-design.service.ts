import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriberDesignePreference } from '../../entities/subscriber-designe-preference.entity';
import { ValidateSubscriberDesignResponseDto } from '../../dto/validate-subscriber-design.dto';
import { SubscribersValidationService } from 'src/subscribers/services/validation';

@Injectable()
export class SubscriberDesignePreferenceValidateDesignService {
  constructor(
    @InjectRepository(SubscriberDesignePreference)
    private readonly subscriberDesignePreferenceRepository: Repository<SubscriberDesignePreference>,
    private readonly subscribersValidationService: SubscribersValidationService,
  ) {}

  async execute(
    subscriberId: string,
  ): Promise<ValidateSubscriberDesignResponseDto> {
    // Validate subscriber exists
    await this.subscribersValidationService.validateExists(subscriberId);
    // Check if subscriber has a custom design preference
    const subscriberDesignePreference =
      await this.subscriberDesignePreferenceRepository.findOne({
        where: { subscriber: { subscriberId } },
        relations: [
          'subscriptionDetailDesigneMode',
          'subscriptionDetailDesigneMode.designerMode',
        ],
      });
    if (
      subscriberDesignePreference &&
      subscriberDesignePreference.subscriptionDetailDesigneMode
    )
      return {
        hasCustomDesign: true,
        designCode:
          subscriberDesignePreference.subscriptionDetailDesigneMode.designerMode
            .code,
      };
    return {
      hasCustomDesign: false,
    };
  }
}
