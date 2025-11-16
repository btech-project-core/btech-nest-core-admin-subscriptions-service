import { Injectable } from '@nestjs/common';
import { SubscriptionDetailDesigneMode } from 'src/subscription-detail-designe-mode/entities/subscription-detail-designe-mode.entity';
import { SubscriberDesignePreference } from '../../entities/subscriber-designe-preference.entity';
import { ValidateSubscriberDesignResponseDto } from '../../dto/validate-subscriber-design.dto';
import { SubscriberDesignePreferenceValidateSubscriptionDetailDesigneModeService } from './subscriber-designe-preference-validate-subscription-detail-designe-mode.service';
import { SubscriberDesignePreferenceValidateDetailsService } from './subscriber-designe-preference-validate-details.service';
import { SubscriberDesignePreferenceValidateDesignService } from './subscriber-designe-preference-validate-design.service';

@Injectable()
export class SubscriberDesignePreferenceValidationService {
  constructor(
    private readonly subscriberDesignePreferenceValidateSubscriptionDetailDesigneModeService: SubscriberDesignePreferenceValidateSubscriptionDetailDesigneModeService,
    private readonly subscriberDesignePreferenceValidateDetailsService: SubscriberDesignePreferenceValidateDetailsService,
    private readonly subscriberDesignePreferenceValidateDesignService: SubscriberDesignePreferenceValidateDesignService,
  ) {}

  async validateSubscriptionDetailDesigneModeExists(
    subscriptionDetailDesigneModeId: string,
  ): Promise<SubscriptionDetailDesigneMode> {
    return await this.subscriberDesignePreferenceValidateSubscriptionDetailDesigneModeService.execute(
      subscriptionDetailDesigneModeId,
    );
  }

  async validateDetails(
    subscriberId: string,
  ): Promise<SubscriberDesignePreference | null> {
    return await this.subscriberDesignePreferenceValidateDetailsService.execute(
      subscriberId,
    );
  }

  async validateDesign(
    subscriberId: string,
  ): Promise<ValidateSubscriberDesignResponseDto> {
    return await this.subscriberDesignePreferenceValidateDesignService.execute(
      subscriberId,
    );
  }
}
