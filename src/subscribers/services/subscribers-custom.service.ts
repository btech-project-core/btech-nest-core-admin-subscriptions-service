import { HttpStatus, Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Subscriber } from '../entities';
import { FindOneSubscriberByIdResponseDto } from '../dto';
import { formatFindOneSubscriberIdResponse } from '../helpers';
import { StatusSubscription } from 'src/subscriptions/enums';
import { AdminPersonsService } from 'src/common/services';
import { envs, SERVICE_NAME } from 'src/config';
import { CodeService, CodeFeatures } from 'src/common/enums';
import { SubscriberInfoResponseDto } from 'src/common/dto';
import { formatSubscriberInfoResponse } from '../helpers';
import { SubscribersSubscriptionDetailCoreService } from 'src/subscribers-subscription-detail/services/subscribers-subscription-detail-core.service';
import { SubscriberRoleCoreService } from './subscriber-role-core.service';
import { RolesCustomService } from 'src/roles/services/roles-custom.service';
import { SubscriptionsBussinesCustomService } from 'src/subscriptions-bussines/services/subscriptions-bussines-custom.service';
import { SubscriptionsDetailCustomService } from 'src/subscriptions-detail/services/subscriptions-detail-custom.service';

@Injectable()
export class SubscribersCustomService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    private readonly adminPersonsService: AdminPersonsService,
    private readonly subscribersSubscriptionDetailCoreService: SubscribersSubscriptionDetailCoreService,
    private readonly subscriberRoleCoreService: SubscriberRoleCoreService,
    private readonly rolesCustomService: RolesCustomService,
    private readonly subscriptionsBussinesCustomService: SubscriptionsBussinesCustomService,
    @Inject(forwardRef(() => SubscriptionsDetailCustomService))
    private readonly subscriptionsDetailCustomService: SubscriptionsDetailCustomService,
  ) {}

  async findOneBySubscriberId(
    subscriberId: string,
  ): Promise<FindOneSubscriberByIdResponseDto> {
    const queryBuilder =
      this.subscriberRepository.createQueryBuilder('subscriber');
    queryBuilder
      .leftJoinAndSelect(
        'subscriber.subscriptionsBussine',
        'subscriptionsBussine',
      )
      .leftJoinAndSelect('subscriptionsBussine.subscription', 'subscription')
      .where('subscriber.subscriberId = :subscriberId', { subscriberId })
      .andWhere('subscription.status = :status', {
        status: StatusSubscription.ACTIVE,
      });
    const subscriber = await queryBuilder.getOne();
    if (!subscriber)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `El usuario no se encuentra registrado`,
      });
    if (
      subscriber.subscriptionsBussine.subscription.status !==
      StatusSubscription.ACTIVE
    )
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'El usuario se encuentra sin suscripción activa',
      });
    return formatFindOneSubscriberIdResponse(subscriber);
  }

  async getSubscriberInfo(
    subscriberId: string,
    service?: CodeService,
  ): Promise<SubscriberInfoResponseDto> {
    const queryBuilder =
      this.subscriberRepository.createQueryBuilder('subscriber');

    queryBuilder
      .leftJoinAndSelect(
        'subscriber.subscriptionsBussine',
        'subscriptionsBussine',
      )
      .leftJoinAndSelect('subscriptionsBussine.subscription', 'subscription')
      .leftJoinAndSelect(
        'subscriptionsBussine.subscriptionDetail',
        'subscriptionDetail',
      )
      .leftJoinAndSelect(
        'subscriptionDetail.subscriptionsService',
        'subscriptionsService',
      )
      .leftJoinAndSelect(
        'subscriber.subscribersSubscriptionDetails',
        'subscribersSubscriptionDetails',
      )
      .leftJoinAndSelect(
        'subscribersSubscriptionDetails.subscriberRoles',
        'subscriberRoles',
      )
      .leftJoinAndSelect('subscriberRoles.role', 'role')
      .leftJoinAndSelect(
        'role.roleSubscriptionDetails',
        'roleSubscriptionDetails',
      )
      .leftJoinAndSelect(
        'roleSubscriptionDetails.subscriptionDetail',
        'roleSubscriptionDetail',
      )
      .where('subscriber.subscriberId = :subscriberId', { subscriberId })
      .andWhere('subscribersSubscriptionDetails.isActive = :isActive', {
        isActive: true,
      })
      .andWhere('subscriberRoles.isActive = :roleActive', { roleActive: true });

    if (service)
      queryBuilder.andWhere('subscriptionsService.code = :service', {
        service,
      });

    const subscriber = await queryBuilder.getOne();

    if (!subscriber)
      throw new RpcException({
        message: `El subscriber con id ${subscriberId} no se encuentra registrado`,
        service: SERVICE_NAME,
      });

    const subscriberNaturalPerson =
      await this.adminPersonsService.findOneNaturalPersonBySubscriberId(
        subscriber.naturalPersonId,
      );

    const subscriptionPersonData =
      await this.adminPersonsService.findOneSubscriptionPersonData(
        subscriber.subscriptionsBussine.personId,
      );

    return formatSubscriberInfoResponse(
      subscriber,
      subscriberNaturalPerson,
      subscriptionPersonData,
    );
  }

  async querySubscriberByUsername(
    username: string,
    domain: string,
    service: CodeService,
  ): Promise<Subscriber | null> {
    const queryBuilder =
      this.subscriberRepository.createQueryBuilder('subscriber');
    queryBuilder
      .leftJoinAndSelect(
        'subscriber.subscriptionsBussine',
        'subscriptionsBussine',
      )
      .innerJoin(
        'subscriptionsBussine.subscriptionDetail',
        'subscriptionDetail',
      )
      .innerJoin(
        'subscriptionDetail.subscriptionsService',
        'subscriptionsService',
        'subscriptionsService.code = :service',
        { service },
      )
      .leftJoinAndSelect(
        'subscriptionsBussine.subscriptionDetail',
        'subscriptionDetailLoaded',
        'subscriptionDetailLoaded.subscriptionDetailId = subscriptionDetail.subscriptionDetailId',
      )
      .leftJoinAndSelect(
        'subscriptionDetailLoaded.subscriptionsService',
        'subscriptionsServiceLoaded',
      )
      .leftJoinAndSelect('subscriptionsBussine.subscription', 'subscription')
      .leftJoinAndSelect(
        'subscriber.subscribersSubscriptionDetails',
        'subscribersSubscriptionDetails',
      )
      .leftJoinAndSelect(
        'subscribersSubscriptionDetails.subscriberRoles',
        'subscriberRoles',
      )
      .leftJoinAndSelect('subscriberRoles.role', 'role')
      .leftJoinAndSelect(
        'role.roleSubscriptionDetails',
        'roleSubscriptionDetails',
      )
      .leftJoinAndSelect(
        'roleSubscriptionDetails.subscriptionDetail',
        'roleSubscriptionDetail',
      )
      .where('subscriber.username = :username', { username })
      .andWhere(
        'subscribersSubscriptionDetails.subscriptionDetail = subscriptionDetail.subscriptionDetailId',
      )
      .andWhere('subscribersSubscriptionDetails.isActive = :isActive', {
        isActive: true,
      })
      .andWhere('subscriberRoles.isActive = :roleActive', { roleActive: true });

    if (domain !== envs.domain.principal) {
      queryBuilder
        .leftJoinAndSelect(
          'subscriptionDetailLoaded.subscriptionDetailFeatures',
          'subscriptionDetailFeatures',
        )
        .leftJoinAndSelect(
          'subscriptionDetailFeatures.subscriptionFeatures',
          'subscriptionFeatures',
        );
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(
            'subscriptionDetail.subscriptionDetailId = :subscriptionDetailId',
            { subscriptionDetailId: domain },
          ).orWhere(
            'subscriptionFeatures.code = :code AND subscriptionDetailFeatures.value = :domain',
            {
              code: CodeFeatures.DOM,
              domain: domain,
            },
          );
        }),
      );
    }
    const subscriber = await queryBuilder.getOne();
    return subscriber || null;
  }

  async deleteSubscribersAlternal(): Promise<{ message: string }> {
    const fs = await import('fs/promises');
    const path = await import('path');

    const subscribersSince30Sep = await this.subscriberRepository
      .createQueryBuilder('subscriber')
      .select(['subscriber.username', 'subscriber.createdAt'])
      .where('subscriber.createdAt >= :startDate', {
        startDate: '2025-09-30 00:00:00',
      })
      .orderBy('subscriber.createdAt', 'ASC')
      .getMany();
    if (subscribersSince30Sep.length === 0)
      return {
        message: 'No se encontraron subscribers desde el 30 de septiembre',
      };
    const usernames = subscribersSince30Sep.map((sub) => sub.username);
    // Guardar el JSON
    const outputPath = path.join(
      process.cwd(),
      'src',
      'json-backups',
      'subscribers-since-sept-30.json',
    );
    await fs.writeFile(outputPath, JSON.stringify(usernames, null, 2));
    return {
      message: `Se encontraron ${subscribersSince30Sep.length} subscribers registrados desde el 30 de septiembre. Usernames guardados en: ${outputPath}`,
    };
  }

  async findSubscribersByNaturalPersonId(
    naturalPersonId: string,
  ): Promise<Subscriber[]> {
    return await this.subscriberRepository.find({
      where: { naturalPersonId },
      relations: ['subscriptionsBussine', 'subscribersSubscriptionDetails'],
    });
  }
}
