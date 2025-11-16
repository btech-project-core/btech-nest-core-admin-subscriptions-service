import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { SubscriptionDetailDesigneMode } from 'src/subscription-detail-designe-mode/entities/subscription-detail-designe-mode.entity';

@Injectable()
export class SubscriberDesignePreferenceValidateSubscriptionDetailDesigneModeService {
  constructor(
    @InjectRepository(SubscriptionDetailDesigneMode)
    private readonly subscriptionDetailDesigneModeRepository: Repository<SubscriptionDetailDesigneMode>,
  ) {}

  async execute(
    subscriptionDetailDesigneModeId: string,
  ): Promise<SubscriptionDetailDesigneMode> {
    const subscriptionDetailDesigneMode =
      await this.subscriptionDetailDesigneModeRepository.findOne({
        where: {
          subscriptionDetailDesigneModeId:
            subscriptionDetailDesigneModeId.trim(),
          isActive: true,
        },
        relations: ['designerMode'],
      });
    if (!subscriptionDetailDesigneMode)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Modo de diseño con ID '${subscriptionDetailDesigneModeId}' no encontrado o inactivo`,
      });
    return subscriptionDetailDesigneMode;
  }
}
