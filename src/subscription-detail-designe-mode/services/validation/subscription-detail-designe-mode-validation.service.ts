import { Injectable } from '@nestjs/common';
import { SubscriptionDetailDesigneModeValidateOnlyOnePrimaryService } from './subscription-detail-designe-mode-validate-only-one-primary.service';
import { SubscriptionDetailDesigneModeValidateUniqueModeCombinationService } from './subscription-detail-designe-mode-validate-unique-mode-combination.service';
import { SubscriptionDetailDesigneModeValidateSystemDefaultRequirementsService } from './subscription-detail-designe-mode-validate-system-default-requirements.service';

@Injectable()
export class SubscriptionDetailDesigneModeValidationService {
  constructor(
    private readonly subscriptionDetailDesigneModeValidateOnlyOnePrimaryService: SubscriptionDetailDesigneModeValidateOnlyOnePrimaryService,
    private readonly subscriptionDetailDesigneModeValidateUniqueModeCombinationService: SubscriptionDetailDesigneModeValidateUniqueModeCombinationService,
    private readonly subscriptionDetailDesigneModeValidateSystemDefaultRequirementsService: SubscriptionDetailDesigneModeValidateSystemDefaultRequirementsService,
  ) {}

  async validateOnlyOnePrimary(subscriptionDetailId: string): Promise<boolean> {
    return await this.subscriptionDetailDesigneModeValidateOnlyOnePrimaryService.execute(
      subscriptionDetailId,
    );
  }

  async validateUniqueModeCombination(
    subscriptionDetailId: string,
    designerModeId: string,
  ): Promise<boolean> {
    return await this.subscriptionDetailDesigneModeValidateUniqueModeCombinationService.execute(
      subscriptionDetailId,
      designerModeId,
    );
  }

  async validateSystemDefaultRequirements(
    subscriptionDetailId: string,
    designerModeCode: string,
  ): Promise<boolean> {
    return await this.subscriptionDetailDesigneModeValidateSystemDefaultRequirementsService.execute(
      subscriptionDetailId,
      designerModeCode,
    );
  }
}
