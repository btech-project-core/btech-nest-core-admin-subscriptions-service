import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Subscriber } from '../../entities';
import { FindOneUsernameResponseDto } from '../../dto';
import { formatFindOneUsernameResponse } from '../../helpers';
import { StatusSubscription } from 'src/subscriptions/enums';
import { CodeService } from 'src/common/enums';
import { AdminPersonsService } from 'src/common/services';
import { SubscribersQueryByUsernameService } from './subscribers-query-by-username.service';
import { SubscribersQueryGlobalByUsernameService } from './subscribers-query-global-by-username.service';
import { SubscribersValidationService } from '../validation/subscribers-validation.service';

@Injectable()
export class SubscribersFindOneByUsernameService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    private readonly adminPersonsService: AdminPersonsService,
    private readonly subscribersQueryByUsernameService: SubscribersQueryByUsernameService,
    private readonly subscribersQueryGlobalByUsernameService: SubscribersQueryGlobalByUsernameService,
    private readonly subscribersValidationService: SubscribersValidationService,
  ) {}

  async execute(
    username: string,
    domain: string,
    service: CodeService,
    role?: string,
    allowGlobalUser: boolean = true,
  ): Promise<FindOneUsernameResponseDto> {
    let usernameToSearch = username;
    // Buscar usuario regular del servicio
    let subscriber = await this.subscribersQueryByUsernameService.execute(
      usernameToSearch,
      domain,
      service,
    );
    // Buscar usuario global solo si está permitido
    let globalSubscriber: Subscriber | null = null;
    if (allowGlobalUser)
      globalSubscriber =
        await this.subscribersQueryGlobalByUsernameService.execute(
          usernameToSearch,
        );
    // Si no encuentra ninguno, intentar con documento
    if (!subscriber && !globalSubscriber) {
      const isValidWithDocumentNumber =
        await this.adminPersonsService.isValidDocumentNumberForUser(username);
      const newUsername =
        await this.subscribersValidationService.isValidByNaturalPersonId(
          isValidWithDocumentNumber.naturalPersonIds,
          service,
        );
      usernameToSearch = newUsername;
      // Buscar nuevamente con el username obtenido del documento
      subscriber = await this.subscribersQueryByUsernameService.execute(
        usernameToSearch,
        domain,
        service,
      );
      if (allowGlobalUser) {
        globalSubscriber =
          await this.subscribersQueryGlobalByUsernameService.execute(
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
}
