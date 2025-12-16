import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Subscriber } from '../../entities';
import { UserProfileResponseDto } from 'src/common/dto';
import { PersonResponseDto } from 'src/common/dto';
import { formatSubscriberWithLoginResponse } from '../../helpers';
import { CodeService } from 'src/common/enums';
import { AdminPersonsService } from 'src/common/services';

@Injectable()
export class SubscribersFindOneByIdWithLoginService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    private readonly adminPersonsService: AdminPersonsService,
  ) {}

  async execute(
    subscriberId: string,
    service?: CodeService,
  ): Promise<UserProfileResponseDto | null> {
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
      .where('subscriber.subscriberId = :subscriberId', { subscriberId });
    // Solo aplicar condiciones de relaciones si existen (usuarios no globales)
    queryBuilder.andWhere(
      '(subscribersSubscriptionDetails.isActive = :isActive OR subscriber.subscriptionsBussineId IS NULL)',
      { isActive: true },
    );
    queryBuilder.andWhere(
      '(subscriberRoles.isActive = :roleActive OR subscriber.subscriptionsBussineId IS NULL)',
      { roleActive: true },
    );
    if (service) {
      queryBuilder.andWhere(
        '(subscriptionsService.code = :service OR subscriber.subscriptionsBussineId IS NULL)',
        { service },
      );
      queryBuilder.andWhere(
        '(subscribersSubscriptionDetails.subscriptionDetail = subscriptionDetail.subscriptionDetailId OR subscriber.subscriptionsBussineId IS NULL)',
      );
    }
    const subscriber = await queryBuilder.getOne();
    if (!subscriber)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `El usuario no se encuentra registrado`,
      });
    const subscriberNaturalPerson =
      await this.adminPersonsService.findOneNaturalPersonById(
        subscriber.naturalPersonId,
      );
    // Verificar si es usuario global
    const isGlobalUser = subscriber.subscriptionsBussine === null;
    const subscriptionPersonData: PersonResponseDto = isGlobalUser
      ? {
          personId: 'global',
          fullName: 'BTECH Desarrollo',
        }
      : await this.adminPersonsService.findOneSubscriptionPersonData(
          subscriber.subscriptionsBussine.personId,
        );
    return formatSubscriberWithLoginResponse(
      subscriber,
      subscriberNaturalPerson,
      subscriptionPersonData,
      isGlobalUser,
    );
  }
}
