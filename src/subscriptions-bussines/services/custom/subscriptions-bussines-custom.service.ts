import { Injectable } from '@nestjs/common';
import { SubscriptionsBussine } from '../../entities/subscriptions-bussine.entity';
import { SubscriptionsBussinesGetClientPersonIdsService } from './subscriptions-bussines-get-client-person-ids.service';
import { SubscriptionsBussinesFindOneByDomainOrTenantIdService } from './subscriptions-bussines-find-one-by-domain-or-tenant-id.service';
import { SubscriptionsBussinesFindBussineIdByDetailIdService } from './subscriptions-bussines-find-bussine-id-by-detail-id.service';

@Injectable()
export class SubscriptionsBussinesCustomService {
  constructor(
    private readonly subscriptionsBussinesGetClientPersonIdsService: SubscriptionsBussinesGetClientPersonIdsService,
    private readonly subscriptionsBussinesFindOneByDomainOrTenantIdService: SubscriptionsBussinesFindOneByDomainOrTenantIdService,
    private readonly subscriptionsBussinesFindBussineIdByDetailIdService: SubscriptionsBussinesFindBussineIdByDetailIdService,
  ) {}

  async getClientPersonIds(): Promise<string[]> {
    return await this.subscriptionsBussinesGetClientPersonIdsService.execute();
  }

  async findOneByDomainOrTenantId(
    domain: string,
  ): Promise<SubscriptionsBussine> {
    return await this.subscriptionsBussinesFindOneByDomainOrTenantIdService.execute(
      domain,
    );
  }

  async findSubscriptionBussineIdBySubscriptionDetailId(
    subscriptionDetailId: string,
  ): Promise<string> {
    return await this.subscriptionsBussinesFindBussineIdByDetailIdService.execute(
      subscriptionDetailId,
    );
  }
}
