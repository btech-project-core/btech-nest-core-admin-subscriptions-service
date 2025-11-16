import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionsService } from '../../entities/subscriptions-service.entity';
import { Repository } from 'typeorm';
import {
  CreateSubscriptionsServiceDto,
  CreateSubscriptionsServiceResponseDto,
} from '../../dto/create-subscriptions-service.dto';
import { formatSubscriptionsServiceResponse } from '../../helpers/format-subscriptions-service-response.helper';

@Injectable()
export class SubscriptionsServicesCreateService {
  constructor(
    @InjectRepository(SubscriptionsService)
    private readonly subscriptionsServicesRepository: Repository<SubscriptionsService>,
  ) {}

  async execute(
    createSubscriptionsServiceDto: CreateSubscriptionsServiceDto,
  ): Promise<CreateSubscriptionsServiceResponseDto> {
    const subscriptionsService = this.subscriptionsServicesRepository.create(
      createSubscriptionsServiceDto,
    );
    await this.subscriptionsServicesRepository.save(subscriptionsService);
    return formatSubscriptionsServiceResponse(subscriptionsService);
  }
}
