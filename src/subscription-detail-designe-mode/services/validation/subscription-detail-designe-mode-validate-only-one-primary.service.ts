import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { SubscriptionDetailDesigneMode } from '../../entities/subscription-detail-designe-mode.entity';

@Injectable()
export class SubscriptionDetailDesigneModeValidateOnlyOnePrimaryService {
  constructor(
    @InjectRepository(SubscriptionDetailDesigneMode)
    private readonly subscriptionDetailDesigneModeRepository: Repository<SubscriptionDetailDesigneMode>,
  ) {}

  async execute(subscriptionDetailId: string): Promise<boolean> {
    const primaryCount =
      await this.subscriptionDetailDesigneModeRepository.count({
        where: {
          subscriptionDetail: { subscriptionDetailId },
          isPrimary: true,
        },
      });
    if (primaryCount > 1)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Solo puede existir un modo principal por subscriptionDetail.`,
      });
    return true;
  }
}
