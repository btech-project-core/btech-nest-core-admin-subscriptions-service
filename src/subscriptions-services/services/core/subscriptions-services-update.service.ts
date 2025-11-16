import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionsService } from '../../entities/subscriptions-service.entity';
import { Repository } from 'typeorm';
import {
  UpdateSubscriptionsServiceDto,
  UpdateSubscriptionsServiceResponseDto,
} from '../../dto/update-subscriptions-service.dto';
import { formatSubscriptionsServiceResponse } from '../../helpers/format-subscriptions-service-response.helper';
import { SubscriptionsServicesFindOneService } from './subscriptions-services-find-one.service';

@Injectable()
export class SubscriptionsServicesUpdateService {
  constructor(
    @InjectRepository(SubscriptionsService)
    private readonly subscriptionsServicesRepository: Repository<SubscriptionsService>,
    private readonly subscriptionsServicesFindOneService: SubscriptionsServicesFindOneService,
  ) {}

  async execute(
    updateSubscriptionsServiceDto: UpdateSubscriptionsServiceDto,
  ): Promise<UpdateSubscriptionsServiceResponseDto> {
    const { subscriptionsServiceId, code, description } =
      updateSubscriptionsServiceDto;
    const subscriptionsService =
      await this.subscriptionsServicesFindOneService.execute(
        subscriptionsServiceId,
      );
    subscriptionsService.code = code ?? subscriptionsService.code;
    subscriptionsService.description =
      description ?? subscriptionsService.description;
    await this.subscriptionsServicesRepository.save(subscriptionsService);
    return formatSubscriptionsServiceResponse(subscriptionsService);
  }
}
