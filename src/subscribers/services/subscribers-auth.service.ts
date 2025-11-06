import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Subscriber } from '../entities/subscriber.entity';
import { FindOneUsernameResponseDto } from '../dto';
import { formatFindOneUsernameResponse } from '../helpers/format-find-one-username-response.helper';
import { formatSubscriberWithLoginResponse } from '../helpers/format-subscriber-with-login-response.helper';
import { UserProfileResponseDto } from 'src/common/dto/user-profile.dto';
import { PersonResponseDto } from 'src/common/dto/person.dto';
import { StatusSubscription } from 'src/subscriptions/enums/status-subscription.enum';
import { CodeService } from 'src/common/enums/code-service.enum';
import { AdminPersonsService } from 'src/common/services/admin-persons.service';
import { SubscribersCustomService } from './subscribers-custom.service';
import { SubscribersValidateService } from './subscribers-validate.service';

@Injectable()
export class SubscribersAuthService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    private readonly adminPersonsService: AdminPersonsService,
    private readonly subscribersCustomService: SubscribersCustomService,
    private readonly subscribersValidateService: SubscribersValidateService,
  ) {}

  async findOneByUsername(
    username: string,
    domain: string,
    service: CodeService,
    role?: string,
    allowGlobalUser: boolean = true,
  ): Promise<FindOneUsernameResponseDto> {
    let usernameToSearch = username;
    // Buscar usuario regular del servicio
    let subscriber =
      await this.subscribersCustomService.querySubscriberByUsername(
        usernameToSearch,
        domain,
        service,
      );
    // Buscar usuario global solo si está permitido
    let globalSubscriber: Subscriber | null = null;
    if (allowGlobalUser)
      globalSubscriber =
        await this.subscribersCustomService.queryGlobalSubscriberByUsername(
          usernameToSearch,
        );
    // Si no encuentra ninguno, intentar con documento
    if (!subscriber && !globalSubscriber) {
      const isValidWithDocumentNumber =
        await this.adminPersonsService.isValidDocumentNumberForUser(username);
      const newUsername =
        await this.subscribersValidateService.isValidByNaturalPersonId(
          isValidWithDocumentNumber.naturalPersonIds,
          service,
        );
      usernameToSearch = newUsername;
      // Buscar nuevamente con el username obtenido del documento
      subscriber =
        await this.subscribersCustomService.querySubscriberByUsername(
          usernameToSearch,
          domain,
          service,
        );
      if (allowGlobalUser) {
        globalSubscriber =
          await this.subscribersCustomService.queryGlobalSubscriberByUsername(
            usernameToSearch,
          );
      }
    }
    // Si existe usuario regular
    if (subscriber) {
      if (!subscriber.isActive)
        throw new RpcException({
          status: HttpStatus.FORBIDDEN,
          message: 'El usuario se encuentra inactivo',
        });
      if (
        subscriber.subscriptionsBussine.subscription.status !==
        StatusSubscription.ACTIVE
      )
        throw new RpcException({
          status: HttpStatus.UNAUTHORIZED,
          message: 'El usuario se encuentra sin suscripción activa',
        });
      // Si también existe como usuario global y se solicita role SYS
      if (globalSubscriber && role === 'SYS') {
        // Obtener roles del subscriber regular para combinarlos
        const regularRoles =
          subscriber.subscribersSubscriptionDetails?.flatMap(
            (subDetail) =>
              subDetail.subscriberRoles?.map((role) => role.role.code) || [],
          ) || [];
        const allRoles = [...new Set([...regularRoles, 'SYS'])];
        // Retornar el usuario global con todos los roles
        return formatFindOneUsernameResponse(
          globalSubscriber,
          allRoles,
          true,
          service,
        );
      }
      // Si no se solicita role SYS, retornar el usuario regular
      const additionalRoles = globalSubscriber ? ['SYS'] : [];
      return formatFindOneUsernameResponse(
        subscriber,
        additionalRoles,
        false,
        service,
      );
    }
    // Si solo existe como usuario global
    if (globalSubscriber) {
      // La validación de isActive ya se hizo en la query
      return formatFindOneUsernameResponse(
        globalSubscriber,
        ['SYS'],
        true,
        service,
      );
    }
    // Si no existe en ninguno
    throw new RpcException({
      status: HttpStatus.NOT_FOUND,
      message: `El usuario con el código de acceso: ${username} no se encuentra registrado`,
    });
  }

  async findOneBySubscriberIdWithLogin(
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
      await this.adminPersonsService.findOneNaturalPersonBySubscriberId(
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

  async setPassword(
    subscriberId: string,
    hashedPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    const subscriber = await this.subscriberRepository.findOne({
      where: { subscriberId },
    });
    if (!subscriber)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `El subscriber con ID ${subscriberId} no existe`,
      });
    subscriber.password = hashedPassword;
    await this.subscriberRepository.save(subscriber);
    return {
      success: true,
      message: 'Contraseña actualizada correctamente',
    };
  }
}
