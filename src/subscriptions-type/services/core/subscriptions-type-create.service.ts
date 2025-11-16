import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateSubscriptionsTypeDto,
  CreateSubscriptionsTypeResponseDto,
} from 'src/subscriptions-type/dto/create-subscriptions-type.dto';
import { SubscriptionsType } from 'src/subscriptions-type/entities/subscriptions-type.entity';
import { formatSubscriptionsTypeResponse } from 'src/subscriptions-type/helpers/format-subscriptions-type-response.helper';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionsTypeCreateService {
  constructor(
    @InjectRepository(SubscriptionsType)
    private readonly subscriptionsTypeRepository: Repository<SubscriptionsType>,
  ) {}
  async execute(
    createSubscriptionsTypeDto: CreateSubscriptionsTypeDto,
  ): Promise<CreateSubscriptionsTypeResponseDto> {
    const subscriptionsType = this.subscriptionsTypeRepository.create(
      createSubscriptionsTypeDto,
    );
    await this.subscriptionsTypeRepository.save(subscriptionsType);
    return formatSubscriptionsTypeResponse(subscriptionsType);
  }
}
