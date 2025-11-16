import { Injectable } from '@nestjs/common';
import { FindByDomainResponseDto } from '../../dto/find-by-domain.dto';
import { SubscriptionDetailDesigneModeFindByDomainService } from './subscription-detail-designe-mode-find-by-domain.service';

@Injectable()
export class SubscriptionDetailDesigneModeCustomService {
  constructor(
    private readonly subscriptionDetailDesigneModeFindByDomainService: SubscriptionDetailDesigneModeFindByDomainService,
  ) {}

  async findByDomain(
    domain: string,
    modeCode?: string,
  ): Promise<FindByDomainResponseDto> {
    return await this.subscriptionDetailDesigneModeFindByDomainService.execute(
      domain,
      modeCode,
    );
  }
}
