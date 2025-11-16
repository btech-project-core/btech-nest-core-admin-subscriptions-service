import { Injectable } from '@nestjs/common';
import { FindByDomainOrSubscriptionDetailIdResponseDto } from '../../dto/find-by-domain-or-subscription-detail-id.dto';
import { SubscriptionsDesigneSettingsFindByDomainService } from './subscriptions-designe-settings-find-by-domain.service';

@Injectable()
export class SubscriptionsDesigneSettingsCustomService {
  constructor(
    private readonly subscriptionsDesigneSettingsFindByDomainService: SubscriptionsDesigneSettingsFindByDomainService,
  ) {}

  async findByDomainOrSubscriptionDetailId(
    domain: string,
  ): Promise<FindByDomainOrSubscriptionDetailIdResponseDto> {
    return await this.subscriptionsDesigneSettingsFindByDomainService.execute(
      domain,
    );
  }
}
