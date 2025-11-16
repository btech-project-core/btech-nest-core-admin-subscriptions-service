import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionsService } from '../../entities/subscriptions-service.entity';
import { Repository } from 'typeorm';
import {
  UpdateSubscriptionsServiceStatusDto,
  UpdateSubscriptionsServiceStatusResponseDto,
} from '../../dto/update-subscriptions-service-status.dto';
import { SubscriptionsServicesFindOneService } from './subscriptions-services-find-one.service';
import { SubscriptionsServicesCustomService } from '../custom/subscriptions-services-custom.service';

@Injectable()
export class SubscriptionsServicesUpdateStatusService {
  constructor(
    @InjectRepository(SubscriptionsService)
    private readonly subscriptionsServicesRepository: Repository<SubscriptionsService>,
    private readonly subscriptionsServicesFindOneService: SubscriptionsServicesFindOneService,
    private readonly subscriptionsServicesCustomService: SubscriptionsServicesCustomService,
  ) {}

  async execute(
    updateSubscriptionsServiceStatusDto: UpdateSubscriptionsServiceStatusDto,
  ): Promise<UpdateSubscriptionsServiceStatusResponseDto> {
    const { subscriptionsServiceId, isActive } =
      updateSubscriptionsServiceStatusDto;
    const existingService =
      await this.subscriptionsServicesFindOneService.execute(
        subscriptionsServiceId,
      );
    if (!isActive)
      await this.subscriptionsServicesCustomService.relatedSubscriptionServices(
        subscriptionsServiceId,
      );
    await this.subscriptionsServicesRepository.update(subscriptionsServiceId, {
      isActive,
    });
    const statusMessage = isActive ? 'activado' : 'desactivado';
    return {
      message: `Servicio de suscripción '${existingService.description}' ${statusMessage} exitosamente`,
    };
  }
}
