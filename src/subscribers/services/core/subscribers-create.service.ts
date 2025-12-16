import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscriber } from '../../entities/subscriber.entity';
import {
  CreateSubscriberDto,
  CreateSubscriberResponseDto,
} from '../../dto/create-subscriber.dto';
import { RolesCustomService } from 'src/roles/services/custom/roles-custom.service';
import { SubscriberRoleCoreService } from './subscriber-role-core.service';
import { SubscribersSubscriptionDetailCoreService } from 'src/subscribers-subscription-detail/services/core';
import { SubscriptionDetailCustomService } from 'src/subscriptions-detail/services/custom';
import { SubscriptionsBussinesCustomService } from 'src/subscriptions-bussines/services/custom';
import { AdminPersonsService } from 'src/common/services/admin-persons.service';

@Injectable()
export class SubscribersCreateService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    private readonly subscriptionsBussinesCustomService: SubscriptionsBussinesCustomService,
    private readonly subscriberRoleCoreService: SubscriberRoleCoreService,
    private readonly subscriptionsDetailCustomService: SubscriptionDetailCustomService,
    private readonly subscribersSubscriptionDetailCoreService: SubscribersSubscriptionDetailCoreService,
    private readonly rolesCustomService: RolesCustomService,
    private readonly adminPersonsService: AdminPersonsService,
  ) {}

  async execute(
    createSubscriberDto: CreateSubscriberDto,
  ): Promise<CreateSubscriberResponseDto> {
    const {
      username,
      password,
      naturalPersonId,
      domain,
      service,
      role: roleCode,
      isConfirm,
    } = createSubscriberDto;
    const subscriptionsBussine =
      await this.subscriptionsBussinesCustomService.findOneByDomainOrTenantId(
        domain,
      );
    // Encontrar y validar el subscriptionDetail específico por subscriptionBussineId y service
    const targetSubscriptionDetail =
      await this.subscriptionsDetailCustomService.findOneByBussineIdAndService(
        subscriptionsBussine.subscriptionBussineId,
        service,
      );
    const role = await this.rolesCustomService.findOneByCode(
      roleCode ?? 'CLI',
      targetSubscriptionDetail.subscriptionDetailId,
    );
    // Obtener datos de la persona natural para metadata
    const naturalPersonData =
      await this.adminPersonsService.findOneNaturalPerson({
        naturalPersonId,
        subscriptionBussineId: subscriptionsBussine.subscriptionBussineId,
      });
    // Crear subscriber básico con metadata
    const subscriber = this.subscriberRepository.create({
      username,
      password,
      isConfirm: isConfirm ?? true,
      naturalPersonId,
      subscriptionsBussine,
      metadata: naturalPersonData,
    });
    const subscriberSaved = await this.subscriberRepository.save(subscriber);
    // Crear la relación intermedia con el servicio específico
    const subscribersSubscriptionDetail =
      await this.subscribersSubscriptionDetailCoreService.create(
        subscriberSaved,
        targetSubscriptionDetail,
        true,
      );
    // Crear la asignación del rol para este servicio específico
    await this.subscriberRoleCoreService.create(
      subscribersSubscriptionDetail,
      role,
      true,
    );
    return {
      subscriberId: subscriberSaved.subscriberId,
      username: subscriberSaved.username,
    };
  }
}
