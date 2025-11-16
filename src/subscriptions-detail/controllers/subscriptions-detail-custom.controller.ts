import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { FindDomainsDto } from '../dto/find-domains.dto';
import { SubscriptionDetailFeaturesCustomService } from '../services/custom';

@Controller()
export class SubscriptionsDetailCustomController {
  constructor(
    private readonly subscriptionDetailFeaturesCustomService: SubscriptionDetailFeaturesCustomService,
  ) {}

  @GrpcMethod('SubscriptionDetailFeaturesService', 'FindDomains')
  async findDomains(findDomainsDto: FindDomainsDto) {
    return await this.subscriptionDetailFeaturesCustomService.findActiveDomains(
      findDomainsDto.service,
    );
  }
}
