import { Injectable } from '@nestjs/common';
import {
  CreateSubscriptionsServiceDto,
  CreateSubscriptionsServiceResponseDto,
} from '../../dto/create-subscriptions-service.dto';
import {
  FindAllSubscriptionsServiceDto,
  FindAllSubscriptionsServiceResponseDto,
} from '../../dto/find-all-subscription-service.dto';
import {
  UpdateSubscriptionsServiceDto,
  UpdateSubscriptionsServiceResponseDto,
} from '../../dto/update-subscriptions-service.dto';
import {
  UpdateSubscriptionsServiceStatusDto,
  UpdateSubscriptionsServiceStatusResponseDto,
} from '../../dto/update-subscriptions-service-status.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import { SubscriptionsServicesCreateService } from './subscriptions-services-create.service';
import { SubscriptionsServicesFindAllService } from './subscriptions-services-find-all.service';
import { SubscriptionsServicesFindOneService } from './subscriptions-services-find-one.service';
import { SubscriptionsServicesUpdateService } from './subscriptions-services-update.service';
import { SubscriptionsServicesUpdateStatusService } from './subscriptions-services-update-status.service';
import { SubscriptionsService } from '../../entities/subscriptions-service.entity';

@Injectable()
export class SubscriptionsServicesCoreService {
  constructor(
    private readonly subscriptionsServicesCreateService: SubscriptionsServicesCreateService,
    private readonly subscriptionsServicesFindAllService: SubscriptionsServicesFindAllService,
    private readonly subscriptionsServicesFindOneService: SubscriptionsServicesFindOneService,
    private readonly subscriptionsServicesUpdateService: SubscriptionsServicesUpdateService,
    private readonly subscriptionsServicesUpdateStatusService: SubscriptionsServicesUpdateStatusService,
  ) {}

  async create(
    createSubscriptionsServiceDto: CreateSubscriptionsServiceDto,
  ): Promise<CreateSubscriptionsServiceResponseDto> {
    return await this.subscriptionsServicesCreateService.execute(
      createSubscriptionsServiceDto,
    );
  }

  async findAll(
    findAllSubscriptionsServiceDto: FindAllSubscriptionsServiceDto,
  ): Promise<
    | FindAllSubscriptionsServiceResponseDto[]
    | PaginationResponseDto<FindAllSubscriptionsServiceResponseDto>
  > {
    return await this.subscriptionsServicesFindAllService.execute(
      findAllSubscriptionsServiceDto,
    );
  }

  async findOne(subscriptionsServiceId: string): Promise<SubscriptionsService> {
    return await this.subscriptionsServicesFindOneService.execute(
      subscriptionsServiceId,
    );
  }

  async update(
    updateSubscriptionsServiceDto: UpdateSubscriptionsServiceDto,
  ): Promise<UpdateSubscriptionsServiceResponseDto> {
    return await this.subscriptionsServicesUpdateService.execute(
      updateSubscriptionsServiceDto,
    );
  }

  async updateStatus(
    updateSubscriptionsServiceStatusDto: UpdateSubscriptionsServiceStatusDto,
  ): Promise<UpdateSubscriptionsServiceStatusResponseDto> {
    return await this.subscriptionsServicesUpdateStatusService.execute(
      updateSubscriptionsServiceStatusDto,
    );
  }
}
