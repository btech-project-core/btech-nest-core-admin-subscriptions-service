import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { SubscriptionDetailDesigneMode } from '../../entities/subscription-detail-designe-mode.entity';

@Injectable()
export class SubscriptionDetailDesigneModeValidateUniqueModeCombinationService {
  constructor(
    @InjectRepository(SubscriptionDetailDesigneMode)
    private readonly subscriptionDetailDesigneModeRepository: Repository<SubscriptionDetailDesigneMode>,
  ) {}

  async execute(
    subscriptionDetailId: string,
    designerModeId: string,
  ): Promise<boolean> {
    const existing = await this.subscriptionDetailDesigneModeRepository.findOne(
      {
        where: {
          subscriptionDetail: { subscriptionDetailId },
          designerMode: { designerModeId },
        },
      },
    );
    if (existing)
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        message: `Ya existe un registro con este subscriptionDetail y designerMode.`,
      });
    return true;
  }
}
