import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UpdateSubscriptionsTypeStatusDto,
  UpdateSubscriptionsTypeStatusResponseDto,
} from 'src/subscriptions-type/dto/update-subscriptions-type-status.dto';
import { SubscriptionsType } from 'src/subscriptions-type/entities/subscriptions-type.entity';
import { Repository } from 'typeorm';
import { SubscriptionsTypeFindOneService } from './subscriptions-type-find-one.service';
import { SubscriptionsTypeCustomService } from '../custom';

@Injectable()
export class SubscriptionsTypeUpdateStatusService {
  constructor(
    @InjectRepository(SubscriptionsType)
    private readonly subscriptionsTypeRepository: Repository<SubscriptionsType>,
    private readonly subscriptionsTypeFindOneService: SubscriptionsTypeFindOneService,
    private readonly subscriptionsTypeCustomService: SubscriptionsTypeCustomService,
  ) {}
  async updateStatus(
    updateSubscriptionsTypeStatusDto: UpdateSubscriptionsTypeStatusDto,
  ): Promise<UpdateSubscriptionsTypeStatusResponseDto> {
    const { subscriptionTypeId, isActive } = updateSubscriptionsTypeStatusDto;
    const existingSubscriptionsType =
      await this.subscriptionsTypeFindOneService.execute(subscriptionTypeId);

    if (!isActive)
      await this.subscriptionsTypeCustomService.relatedSubscriptions(
        subscriptionTypeId,
      );

    await this.subscriptionsTypeRepository.update(subscriptionTypeId, {
      isActive,
    });

    const statusMessage = isActive ? 'activado' : 'desactivado';
    return {
      message: `Tipo de suscripción '${existingSubscriptionsType.description}' ${statusMessage} exitosamente`,
    };
  }
}
