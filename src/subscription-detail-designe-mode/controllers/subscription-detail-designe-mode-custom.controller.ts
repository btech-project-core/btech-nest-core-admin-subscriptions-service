import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  FindByDomainDto,
  FindByDomainResponseDto,
} from '../dto/find-by-domain.dto';
import { SubscriptionDetailDesigneModeCustomService } from '../services/custom';

@Controller()
export class SubscriptionDetailDesigneModeCustomController {
  constructor(
    private readonly subscriptionDetailDesigneModeCustomService: SubscriptionDetailDesigneModeCustomService,
  ) {}

  @GrpcMethod('SubscribersService', 'FindByDomainOrSubscriptionDetailId')
  async findByDomain(data: FindByDomainDto): Promise<FindByDomainResponseDto> {
    return await this.subscriptionDetailDesigneModeCustomService.findByDomain(
      data.domain,
      data.modeCode,
    );
  }
}
