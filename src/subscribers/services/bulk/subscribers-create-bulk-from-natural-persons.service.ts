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
import { SubscriptionDetail } from 'src/subscriptions-detail/entities/subscription-detail.entity';
import * as bcrypt from 'bcryptjs';
import { RolesCustomService } from 'src/roles/services/custom';
import { SubscriptionsBussine } from 'src/subscriptions-bussines/entities';

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

    // Obtener el rol CLI una sola vez
    const cliRole = await this.rolesService.findOneByCode('CLI');

    // Extraer todos los naturalPersonIds
    const naturalPersonIds = subscribers.map((s) => s.naturalPersonId);

    // Buscar todos los subscribers existentes de una sola vez
    const existingSubscribers = await this.subscriberRepository
      .createQueryBuilder('subscriber')
      .leftJoinAndSelect(
        'subscriber.subscribersSubscriptionDetails',
        'subscribersSubscriptionDetails',
      )
      .leftJoinAndSelect(
        'subscribersSubscriptionDetails.subscriptionDetail',
        'subscriptionDetail',
      )
      .where('subscriber.naturalPersonId IN (:...naturalPersonIds)', {
        naturalPersonIds,
      })
      .andWhere('subscriber.subscriptionsBussine = :subscriptionBussineId', {
        subscriptionBussineId,
      })
      .getMany();

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
        // Verificar si ya está asignado al servicio
        const hasAssignment =
          existingSubscriber.subscribersSubscriptionDetails?.some(
            (detail) =>
              detail.subscriptionDetail?.subscriptionDetailId ===
              subscriptionDetailId,
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

        // Caso 3: Crear nuevos subscribers (bulk insert)
        if (subscribersToCreate.length > 0) {
          const hashedPasswords = await Promise.all(
            subscribersToCreate.map((item) => bcrypt.hash(item.username, 10)),
          );

          const newSubscribersToInsert = subscribersToCreate.map(
            (item, index) => {
              // Parsear metadata string a JSON y combinar con naturalPerson
              let parsedMetadata = {};
              try {
                parsedMetadata = JSON.parse(item.metadata);
              } catch (error) {
                console.log(error);
                // Si falla el parse, usar objeto vacío
                parsedMetadata = {};
              }

              return manager.create(Subscriber, {
                username: item.username,
                password: hashedPasswords[index],
                naturalPersonId: item.naturalPersonId,
                subscriptionsBussine: {
                  subscriptionBussineId,
                } as SubscriptionsBussine,
                isConfirm: true,
                isActive: true,
                metadata: {
                  ...parsedMetadata,
                  naturalPerson: { naturalPersonId: item.naturalPersonId },
                },
              });
            },
          );

          insertedSubscribers = await manager.save(
            Subscriber,
            newSubscribersToInsert,
          );
        }

        // Combinar subscribers a asignar: nuevos + existentes
        const allSubscribersToAssign = [
          ...insertedSubscribers,
          ...subscribersToAssign,
        ];

        if (allSubscribersToAssign.length > 0) {
          // Bulk insert de SubscribersSubscriptionDetail
          const subscriptionDetails = allSubscribersToAssign.map((subscriber) =>
            manager.create(SubscribersSubscriptionDetail, {
              subscriber,
              subscriptionDetail: {
                subscriptionDetailId,
              } as SubscriptionDetail,
              isActive: true,
            }),
          );

          const insertedDetails = await manager.save(
            SubscribersSubscriptionDetail,
            subscriptionDetails,
          );

          // Bulk insert de SubscriberRole
          const subscriberRoles = insertedDetails.map((detail) =>
            manager.create(SubscriberRole, {
              subscribersSubscriptionDetail: detail,
              role: cliRole,
              isActive: true,
            }),
          );

          await manager.save(SubscriberRole, subscriberRoles);
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
