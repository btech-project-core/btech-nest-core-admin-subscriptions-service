import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { SubscriptionDetailDesigneMode } from '../../entities/subscription-detail-designe-mode.entity';

@Injectable()
export class SubscriptionDetailDesigneModeDeleteService {
  constructor(
    @InjectRepository(SubscriptionDetailDesigneMode)
    private readonly subscriptionDetailDesigneModeRepository: Repository<SubscriptionDetailDesigneMode>,
  ) {}

  async execute(
    subscriptionDetailDesigneModeId: string,
  ): Promise<{ message: string }> {
    const record = await this.subscriptionDetailDesigneModeRepository.findOne({
      where: { subscriptionDetailDesigneModeId },
    });

    if (!record) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `El registro con id ${subscriptionDetailDesigneModeId} no se encuentra.`,
      });
    }

    await this.subscriptionDetailDesigneModeRepository.remove(record);

    return {
      message: 'Registro eliminado correctamente',
    };
  }
}
