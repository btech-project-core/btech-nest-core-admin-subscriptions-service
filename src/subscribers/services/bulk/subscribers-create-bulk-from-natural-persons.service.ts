/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscriber } from 'src/subscribers/entities/subscriber.entity';
import { DataSource, Repository } from 'typeorm';
import {
  CreateSubscribersBulkFromNaturalPersonsDto,
  CreateSubscribersBulkFromNaturalPersonsResponseDto,
  SubscriberBulkResultDto,
} from 'src/subscribers/dto/create-subscribers-bulk-from-natural-persons.dto';
import { SubscribersSubscriptionDetail } from 'src/subscribers-subscription-detail/entities/subscribers-subscription-detail.entity';
import { SubscriberRole } from 'src/subscribers/entities/subscriber-role.entity';
import { RolesCustomService } from 'src/roles/services/custom';

@Injectable()
export class SubscribersCreateBulkFromNaturalPersonsService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    private readonly rolesService: RolesCustomService,
    private readonly dataSource: DataSource,
  ) {}

  async execute(
    createBulkDto: CreateSubscribersBulkFromNaturalPersonsDto,
  ): Promise<CreateSubscribersBulkFromNaturalPersonsResponseDto> {
    const { subscribers, subscriptionDetailId, subscriptionBussineId } =
      createBulkDto;

    // Extraer todos los naturalPersonIds
    const naturalPersonIds = subscribers.map((s) => s.naturalPersonId);

    // Ejecutar queries en paralelo para máxima velocidad
    const [cliRole, existingSubscribers, existingAssignments] =
      await Promise.all([
        // Obtener el rol CLI
        this.rolesService.findOneByCode('CLI'),

        // Buscar subscribers existentes (sin JOINs innecesarios)
        this.subscriberRepository
          .createQueryBuilder('subscriber')
          .where('subscriber.naturalPersonId IN (:...naturalPersonIds)', {
            naturalPersonIds,
          })
          .andWhere(
            'subscriber.subscriptionsBussine = :subscriptionBussineId',
            {
              subscriptionBussineId,
            },
          )
          .getMany(),

        // Query separada y eficiente para verificar asignaciones existentes
        this.dataSource
          .createQueryBuilder()
          .select('subscriber.naturalPersonId', 'naturalPersonId')
          .from(Subscriber, 'subscriber')
          .innerJoin(
            'subscriber.subscribersSubscriptionDetails',
            'subscribersSubscriptionDetails',
          )
          .where('subscriber.naturalPersonId IN (:...naturalPersonIds)', {
            naturalPersonIds,
          })
          .andWhere(
            'subscriber.subscriptionsBussine = :subscriptionBussineId',
            {
              subscriptionBussineId,
            },
          )
          .andWhere(
            'subscribersSubscriptionDetails.subscriptionDetail = :subscriptionDetailId',
            { subscriptionDetailId },
          )
          .getRawMany(),
      ]);

    const assignedNaturalPersonIds = new Set(
      existingAssignments.map((a) => a.naturalPersonId),
    );

    // Crear mapa de naturalPersonId -> subscriber existente
    const existingSubscribersMap = new Map(
      existingSubscribers.map((s) => [s.naturalPersonId, s]),
    );

    // Separar los subscribers por caso
    const subscribersToCreate: typeof subscribers = [];
    const subscribersToAssign: Subscriber[] = [];
    const subscribersAlreadyAssigned: SubscriberBulkResultDto[] = [];

    for (const item of subscribers) {
      const existingSubscriber = existingSubscribersMap.get(
        item.naturalPersonId,
      );

      if (!existingSubscriber) {
        // Caso 3: No existe, crear
        subscribersToCreate.push(item);
      } else {
        // Verificar si ya está asignado al servicio (usando Set para O(1) lookup)
        const hasAssignment = assignedNaturalPersonIds.has(
          item.naturalPersonId,
        );

        if (hasAssignment) {
          // Caso 1: Ya está asignado, solo devolver
          subscribersAlreadyAssigned.push({
            subscriberId: existingSubscriber.subscriberId,
            username: existingSubscriber.username,
          });
        } else {
          // Caso 2: Existe pero no está asignado
          subscribersToAssign.push(existingSubscriber);
        }
      }
    }

    const results: SubscriberBulkResultDto[] = [...subscribersAlreadyAssigned];

    // Procesar creaciones y asignaciones en transacción
    if (subscribersToCreate.length > 0 || subscribersToAssign.length > 0) {
      await this.dataSource.transaction(async (manager) => {
        let insertedSubscribers: Subscriber[] = [];

        // Caso 3: Crear nuevos subscribers (bulk insert directo)
        if (subscribersToCreate.length > 0) {
          const newSubscribersData = subscribersToCreate.map((item) => {
            // Parsear metadata string a JSON y combinar con naturalPerson
            let parsedMetadata = {};
            try {
              parsedMetadata = JSON.parse(item.metadata);
            } catch (error) {
              console.log(error);
              parsedMetadata = {};
            }

            return {
              username: item.username,
              naturalPersonId: item.naturalPersonId,
              subscriptionsBussineId: subscriptionBussineId,
              isConfirm: true,
              isActive: true,
              metadata: {
                ...parsedMetadata,
                naturalPerson: { naturalPersonId: item.naturalPersonId },
              },
            };
          });

          // INSERT directo con QueryBuilder (mucho más rápido que save)
          const insertResult = await manager
            .createQueryBuilder()
            .insert()
            .into(Subscriber)
            .values(newSubscribersData as any)
            .execute();

          // Obtener los IDs insertados
          const insertedIds = insertResult.identifiers.map(
            (id) => id.subscriberId,
          );

          // Recuperar los subscribers insertados (necesarios para las relaciones)
          insertedSubscribers = await manager
            .createQueryBuilder(Subscriber, 'subscriber')
            .whereInIds(insertedIds)
            .getMany();
        }

        // Combinar subscribers a asignar: nuevos + existentes
        const allSubscribersToAssign = [
          ...insertedSubscribers,
          ...subscribersToAssign,
        ];

        if (allSubscribersToAssign.length > 0) {
          // Bulk insert de SubscribersSubscriptionDetail (INSERT directo)
          const subscriptionDetailsData = allSubscribersToAssign.map(
            (subscriber) => ({
              subscriberId: subscriber.subscriberId,
              subscriptionDetailId: subscriptionDetailId,
              isActive: true,
            }),
          );

          const insertDetailsResult = await manager
            .createQueryBuilder()
            .insert()
            .into(SubscribersSubscriptionDetail)
            .values(subscriptionDetailsData)
            .execute();

          // Obtener los IDs insertados
          const insertedDetailIds = insertDetailsResult.identifiers.map(
            (id) => id.subscribersSubscriptionDetailId,
          );

          // Bulk insert de SubscriberRole (INSERT directo)
          const subscriberRolesData = insertedDetailIds.map((detailId) => ({
            subscribersSubscriptionDetailId: detailId,
            roleId: cliRole.roleId,
            isActive: true,
          }));

          await manager
            .createQueryBuilder()
            .insert()
            .into(SubscriberRole)
            .values(subscriberRolesData)
            .execute();
        }

        // Agregar nuevos subscribers a resultados
        if (insertedSubscribers.length > 0) {
          results.push(
            ...insertedSubscribers.map((s) => ({
              subscriberId: s.subscriberId,
              username: s.username,
            })),
          );
        }

        // Agregar subscribers existentes asignados a resultados
        if (subscribersToAssign.length > 0) {
          results.push(
            ...subscribersToAssign.map((s) => ({
              subscriberId: s.subscriberId,
              username: s.username,
            })),
          );
        }
      });
    }

    return { results };
  }
}
