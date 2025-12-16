import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Subscriber } from '../../entities';
import { SubscriptionsBussine } from 'src/subscriptions-bussines/entities';
import { SubscribersSubscriptionDetailCoreService } from 'src/subscribers-subscription-detail/services/core';
import { SubscriberRoleCoreService } from '../core/subscriber-role-core.service';
import { RolesCustomService } from 'src/roles/services/custom';
import * as bcryptjs from 'bcryptjs';
import { SubscriptionDetail } from 'src/subscriptions-detail/entities/subscription-detail.entity';
import { AdminPersonsService } from 'src/common/services/admin-persons.service';

@Injectable()
export class SubscribersCreateForNaturalPersonsService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    private readonly subscribersSubscriptionDetailCoreService: SubscribersSubscriptionDetailCoreService,
    private readonly subscriberRoleCoreService: SubscriberRoleCoreService,
    private readonly rolesCustomService: RolesCustomService,
    private readonly adminPersonsService: AdminPersonsService,
  ) {}

  async execute(
    naturalPersons: { naturalPersonId: string; documentNumber: string }[],
    subscriptionsBussine: SubscriptionsBussine,
    subscriptionDetails: SubscriptionDetail[], // Los servicios específicos para los que crear acceso
    queryRunner?: QueryRunner,
  ): Promise<Subscriber[]> {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(Subscriber)
      : this.subscriberRepository;
    // 1. Verificar duplicados en el request actual (no debería haber naturalPersonIds duplicados)
    const naturalPersonIds = naturalPersons.map((np) => np.naturalPersonId);
    const uniqueIds = new Set(naturalPersonIds);
    if (uniqueIds.size !== naturalPersonIds.length)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message:
          'No se pueden enviar naturalPersonIds duplicados en la misma solicitud',
      });
    // Obtener el rol por defecto para usuarios nuevos
    const defaultRole = await this.rolesCustomService.findOneByCode(
      'SAD',
      subscriptionsBussine.subscriptionBussineId,
    );

    // Obtener datos de todas las personas naturales en paralelo
    const naturalPersonsDataPromises = naturalPersons.map((np) =>
      this.adminPersonsService.findOneNaturalPersonById(np.naturalPersonId),
    );
    const naturalPersonsData = await Promise.all(naturalPersonsDataPromises);

    // Crear un mapa para acceso rápido por naturalPersonId
    const naturalPersonDataMap = new Map(
      naturalPersonsData.map((data) => [data.naturalPersonId, data]),
    );

    const subscribersToCreate = await Promise.all(
      naturalPersons.map(async (naturalPerson) => {
        const { naturalPersonId, documentNumber } = naturalPerson;
        const username = documentNumber;
        const hashedPassword = await bcryptjs.hash(username, 10);
        const naturalPersonData = naturalPersonDataMap.get(naturalPersonId);

        return repository.create({
          username,
          password: hashedPassword,
          naturalPersonId,
          subscriptionsBussine,
          isConfirm: true,
          metadata: {
            naturalPerson: naturalPersonData,
          },
        });
      }),
    );

    // 2. Guardar todos los subscribers en una sola operación
    const savedSubscribers = await repository.save(subscribersToCreate);

    // 3. Crear relaciones intermedias y roles para cada subscriber y cada subscriptionDetail
    for (const subscriber of savedSubscribers) {
      // Crear la relación intermedia y rol para cada servicio
      for (const subscriptionDetail of subscriptionDetails) {
        const subscribersSubscriptionDetail =
          await this.subscribersSubscriptionDetailCoreService.create(
            subscriber,
            subscriptionDetail,
            true,
          );

        // Asignar el rol por defecto para este servicio específico
        await this.subscriberRoleCoreService.create(
          subscribersSubscriptionDetail,
          defaultRole,
          true,
        );
      }
    }

    return savedSubscribers;
  }
}
