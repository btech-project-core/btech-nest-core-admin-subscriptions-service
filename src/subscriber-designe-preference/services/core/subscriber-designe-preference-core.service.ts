import { Injectable } from '@nestjs/common';
import {
  CreateOrUpdateSubscriberDesignePreferenceDto,
  CreateOrUpdateSubscriberDesignePreferenceResponseDto,
} from '../../dto/create-or-update-subscriber-designe-preference.dto';
import { SubscriberDesignePreferenceCreateOrUpdateService } from './subscriber-designe-preference-create-or-update.service';

@Injectable()
export class SubscriberDesignePreferenceCoreService {
  constructor(
    private readonly subscriberDesignePreferenceCreateOrUpdateService: SubscriberDesignePreferenceCreateOrUpdateService,
  ) {}

  async createOrUpdate(
    createOrUpdateDto: CreateOrUpdateSubscriberDesignePreferenceDto,
  ): Promise<CreateOrUpdateSubscriberDesignePreferenceResponseDto> {
    return await this.subscriberDesignePreferenceCreateOrUpdateService.execute(
      createOrUpdateDto,
    );
  }
}
