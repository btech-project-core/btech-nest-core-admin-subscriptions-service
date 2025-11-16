import { Injectable } from '@nestjs/common';
import { SubscriptionDetail } from '../../entities/subscription-detail.entity';
import { FindActiveSubscriptionDetailsByBussinesIdResponseDto } from '../../dto/find-active-subscription-details-by-bussines-id.dto';
import { CodeService } from 'src/common/enums/code-service.enum';
import { SubscriptionDetailFindActiveByBussinesIdService } from './subscription-detail-find-active-by-bussines-id.service';
import { SubscriptionDetailFindOneByBussineAndServiceService } from './subscription-detail-find-one-by-bussine-and-service.service';

@Injectable()
export class SubscriptionDetailCustomService {
  constructor(
    private readonly subscriptionDetailFindActiveByBussinesIdService: SubscriptionDetailFindActiveByBussinesIdService,
    private readonly subscriptionDetailFindOneByBussineAndServiceService: SubscriptionDetailFindOneByBussineAndServiceService,
  ) {}

  async findActiveSubscriptionDetailsByBussinesId(
    subscriptionBussineId: string,
  ): Promise<FindActiveSubscriptionDetailsByBussinesIdResponseDto[]> {
    return await this.subscriptionDetailFindActiveByBussinesIdService.execute(
      subscriptionBussineId,
    );
  }

  async findOneByBussineIdAndService(
    subscriptionBussineId: string,
    serviceCode: CodeService,
  ): Promise<SubscriptionDetail> {
    return await this.subscriptionDetailFindOneByBussineAndServiceService.execute(
      subscriptionBussineId,
      serviceCode,
    );
  }
}
