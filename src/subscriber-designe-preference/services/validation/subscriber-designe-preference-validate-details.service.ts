import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriberDesignePreference } from '../../entities/subscriber-designe-preference.entity';

@Injectable()
export class SubscriberDesignePreferenceValidateDetailsService {
  constructor(
    @InjectRepository(SubscriberDesignePreference)
    private readonly subscriberDesignePreferenceRepository: Repository<SubscriberDesignePreference>,
  ) {}

  async execute(
    subscriberId: string,
  ): Promise<SubscriberDesignePreference | null> {
    const subscriberDesignePreference =
      await this.subscriberDesignePreferenceRepository.findOne({
        where: {
          subscriber: { subscriberId },
        },
        relations: [
          'subscriber',
          'subscriptionDetailDesigneMode',
          'subscriptionDetailDesigneMode.designerMode',
        ],
      });
    return subscriberDesignePreference;
  }
}
