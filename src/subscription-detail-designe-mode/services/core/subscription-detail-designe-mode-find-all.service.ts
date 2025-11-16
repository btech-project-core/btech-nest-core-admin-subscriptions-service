import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionDetailDesigneMode } from '../../entities/subscription-detail-designe-mode.entity';

@Injectable()
export class SubscriptionDetailDesigneModeFindAllService {
  constructor(
    @InjectRepository(SubscriptionDetailDesigneMode)
    private readonly subscriptionDetailDesigneModeRepository: Repository<SubscriptionDetailDesigneMode>,
  ) {}

  async execute(): Promise<SubscriptionDetailDesigneMode[]> {
    return await this.subscriptionDetailDesigneModeRepository.find({
      relations: ['subscriptionDetail', 'designerMode'],
    });
  }
}
