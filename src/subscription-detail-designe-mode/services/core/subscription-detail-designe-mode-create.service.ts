import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionDetailDesigneMode } from '../../entities/subscription-detail-designe-mode.entity';
import { CreateSubscriptionDetailDesigneModeDto } from '../../dto/create-subscription-detail-designe-mode.dto';

@Injectable()
export class SubscriptionDetailDesigneModeCreateService {
  constructor(
    @InjectRepository(SubscriptionDetailDesigneMode)
    private readonly subscriptionDetailDesigneModeRepository: Repository<SubscriptionDetailDesigneMode>,
  ) {}

  async execute(
    createDto: CreateSubscriptionDetailDesigneModeDto,
  ): Promise<SubscriptionDetailDesigneMode> {
    const { subscriptionDetailId, designerModeId, isPrimary, isActive } =
      createDto;

    // Si se marca como primario, desmarcar otros primarios del mismo subscriptionDetail
    if (isPrimary) {
      await this.subscriptionDetailDesigneModeRepository.update(
        { subscriptionDetail: { subscriptionDetailId } },
        { isPrimary: false },
      );
    }

    const newRecord = this.subscriptionDetailDesigneModeRepository.create({
      subscriptionDetail: { subscriptionDetailId },
      designerMode: { designerModeId },
      isPrimary: isPrimary ?? false,
      isActive: isActive ?? true,
    });

    return await this.subscriptionDetailDesigneModeRepository.save(newRecord);
  }
}
