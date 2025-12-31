/* eslint-disable @typescript-eslint/no-unsafe-call */
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

        // Caso 3: Crear nuevos subscribers con SQL directo
        if (subscribersToCreate.length > 0) {
          const subscribersValues = subscribersToCreate
            .map((item) => {
              // Parsear metadata string a JSON y combinar con naturalPerson
              let parsedMetadata = {};
              try {
                parsedMetadata = JSON.parse(item.metadata);
              } catch (error) {
                console.log(error);
                parsedMetadata = {};
              }

              const metadata = {
                ...parsedMetadata,
                naturalPerson: { naturalPersonId: item.naturalPersonId },
              };

              const metadataJson = JSON.stringify(metadata).replace(/'/g, "''");

              return `(UUID(), '${item.username.replace(/'/g, "''")}', NULL, '${item.naturalPersonId}', '${subscriptionBussineId}', 1, 1, '${metadataJson}', NOW(), NOW())`;
            })
            .join(',');

          // INSERT con SQL directo - maneja duplicados
          await manager.query(`
            INSERT INTO subscriber (subscriberId, username, password, naturalPersonId, subscriptionsBussineId, isConfirm, isActive, metadata, createdAt, updatedAt)
            VALUES ${subscribersValues}
            ON DUPLICATE KEY UPDATE updatedAt = NOW()
          `);

          console.log('Subscribers inserted:', subscribersToCreate.length);

          // Recuperar los subscribers insertados por naturalPersonId
          const naturalPersonIds = subscribersToCreate.map(
            (s) => s.naturalPersonId,
          );
          insertedSubscribers = await manager
            .createQueryBuilder(Subscriber, 'subscriber')
            .where('subscriber.naturalPersonId IN (:...naturalPersonIds)', {
              naturalPersonIds,
            })
            .andWhere(
              'subscriber.subscriptionsBussineId = :subscriptionBussineId',
              { subscriptionBussineId },
            )
            .getMany();

          console.log('Subscribers retrieved:', insertedSubscribers.length);
        }

        // Combinar subscribers a asignar: nuevos + existentes
        const allSubscribersToAssign = [
          ...insertedSubscribers,
          ...subscribersToAssign,
        ];

        if (allSubscribersToAssign.length > 0) {
          // Bulk insert de SubscribersSubscriptionDetail con SQL directo
          const subscriptionDetailsValues = allSubscribersToAssign
            .map(
              (subscriber) =>
                `(UUID(), '${subscriber.subscriberId}', '${subscriptionDetailId}', 1, NOW(), NOW())`,
            )
            .join(',');

          await manager.query(`
            INSERT INTO subscribersSubscriptionDetail (subscribersSubscriptionDetailId, subscriberId, subscriptionDetailId, isActive, createdAt, updatedAt)
            VALUES ${subscriptionDetailsValues}
            ON DUPLICATE KEY UPDATE updatedAt = NOW()
          `);

          console.log(
            'SubscribersSubscriptionDetail inserted:',
            allSubscribersToAssign.length,
          );

          // Obtener los IDs insertados de SubscribersSubscriptionDetail
          const subscriberIds = allSubscribersToAssign.map(
            (s) => s.subscriberId,
          );

          console.log('Querying SubscribersSubscriptionDetail with:', {
            subscriberIdsCount: subscriberIds.length,
            subscriptionDetailId,
            sampleSubscriberId: subscriberIds[0],
          });

          const insertedDetails = await manager.query(
            `
            SELECT subscribersSubscriptionDetailId
            FROM subscribersSubscriptionDetail
            WHERE subscriberId IN (${subscriberIds.map((id) => `'${id}'`).join(',')})
              AND subscriptionDetailId = ?
          `,
            [subscriptionDetailId],
          );

          console.log(
            'SubscribersSubscriptionDetail retrieved:',
            insertedDetails.length,
          );
          console.log('Sample detail:', insertedDetails[0]);

          // Bulk insert de SubscriberRole con SQL directo
          if (insertedDetails.length > 0) {
            // Validar que todos los IDs sean válidos
            const validDetails = insertedDetails.filter(
              (d) => d.subscribersSubscriptionDetailId,
            );

            if (validDetails.length === 0) {
              console.log(
                'ERROR: No valid subscribersSubscriptionDetailId found!',
              );
              throw new Error(
                'No valid subscribersSubscriptionDetailId for SubscriberRole insert',
              );
            }

            const subscriberRolesValues = validDetails
              .map(
                (detail) =>
                  `(UUID(), '${detail.subscribersSubscriptionDetailId}', '${cliRole.roleId}', 1, NOW(), NOW())`,
              )
              .join(',');

            await manager.query(`
              INSERT INTO subscriberRole (subscriberRoleId, subscribersSubscriptionDetailId, roleId, isActive, createdAt, updatedAt)
              VALUES ${subscriberRolesValues}
              ON DUPLICATE KEY UPDATE updatedAt = NOW()
            `);

            console.log('SubscriberRole inserted:', validDetails.length);
          } else {
            console.log(
              'WARNING: No SubscribersSubscriptionDetail found to create roles!',
            );
          }
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
