import { Injectable } from '@nestjs/common';
import { CodeService } from 'src/common/enums/code-service.enum';
import { FindDomainsResponseDto } from '../../dto/find-domains.dto';
import { SubscriptionDetailFeaturesFindActiveDomainsService } from './subscription-detail-features-find-active-domains.service';
import { SubscriptionDetailFeaturesIsAutoLoginService } from './subscription-detail-features-is-auto-login.service';

@Injectable()
export class SubscriptionDetailFeaturesCustomService {
  constructor(
    private readonly subscriptionDetailFeaturesFindActiveDomainsService: SubscriptionDetailFeaturesFindActiveDomainsService,
    private readonly subscriptionDetailFeaturesIsAutoLoginService: SubscriptionDetailFeaturesIsAutoLoginService,
  ) {}

  async findActiveDomains(service?: CodeService): Promise<FindDomainsResponseDto> {
    return await this.subscriptionDetailFeaturesFindActiveDomainsService.execute(
      service,
    );
  }

  async isAutoLogin(
    subscriberId: string,
    subscriptionDetailId: string,
    subscriptionBussineId: string,
  ): Promise<boolean> {
    return await this.subscriptionDetailFeaturesIsAutoLoginService.execute(
      subscriberId,
      subscriptionDetailId,
      subscriptionBussineId,
    );
  }
}
