import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UpdateSubscriptionsTypeDto,
  UpdateSubscriptionsTypeResponseDto,
} from 'src/subscriptions-type/dto/update-subscriptions-type.dto';
import { SubscriptionsType } from 'src/subscriptions-type/entities/subscriptions-type.entity';
import { Repository } from 'typeorm';
import { SubscriptionsTypeFindOneService } from './subscriptions-type-find-one.service';
import { formatSubscriptionsTypeResponse } from 'src/subscriptions-type/helpers/format-subscriptions-type-response.helper';

@Injectable()
export class SubscriptionsTypeUpdateService {
  constructor(
    @InjectRepository(SubscriptionsType)
    private readonly subscriptionsTypeRepository: Repository<SubscriptionsType>,
    private readonly subscriptionsTypeFindOneService: SubscriptionsTypeFindOneService,
  ) {}
  async execute(
    updateSubscriptionsTypeDto: UpdateSubscriptionsTypeDto,
  ): Promise<UpdateSubscriptionsTypeResponseDto> {
    const { subscriptionTypeId, description } = updateSubscriptionsTypeDto;
    const subscriptionsType =
      await this.subscriptionsTypeFindOneService.execute(subscriptionTypeId);
    subscriptionsType.description =
      description ?? subscriptionsType.description;
    await this.subscriptionsTypeRepository.save(subscriptionsType);
    return formatSubscriptionsTypeResponse(subscriptionsType);
  }
}
