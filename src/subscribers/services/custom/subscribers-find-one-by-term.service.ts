import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscriber } from '../../entities/subscriber.entity';
import {
  FindOneSubscriberByTermDto,
  FindOneSubscriberByTermResponseDto,
} from '../../dto/find-one-subscriber-by-term.dto';
import { AdminPersonsService } from 'src/common/services/admin-persons.service';
import { formatSubscriberByTermResponse } from '../../helpers/format-subscriber-by-term-response.helper';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class SubscribersFindOneByTermService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    private readonly adminPersonsService: AdminPersonsService,
  ) {}

  async execute(
    findOneSubscriberByTermDto: FindOneSubscriberByTermDto,
  ): Promise<FindOneSubscriberByTermResponseDto> {
    const { term, subscriptionDetailId, subscriptionBussineId } =
      findOneSubscriberByTermDto;
    // Paso 1: Intentar buscar persona natural por documentNumber
    const naturalPerson = await this.adminPersonsService.findByDocumentNumber({
      documentNumber: term,
      subscriptionBussineId,
    });
    // Paso 2: Buscar subscriber
    const queryBuilder = this.subscriberRepository
      .createQueryBuilder('subscriber')
      .leftJoinAndSelect(
        'subscriber.subscribersSubscriptionDetails',
        'subscribersSubscriptionDetail',
      )
      .leftJoinAndSelect(
        'subscribersSubscriptionDetail.subscriberRoles',
        'subscriberRoles',
      )
      .leftJoinAndSelect('subscriberRoles.role', 'role')
      .where(
        'subscribersSubscriptionDetail.subscriptionDetailId = :subscriptionDetailId',
        { subscriptionDetailId },
      )
      .andWhere('subscribersSubscriptionDetail.isActive = :ssdIsActive', {
        ssdIsActive: true,
      });

    // Si encontró naturalPerson, buscar subscriber por naturalPersonId
    if (naturalPerson) {
      queryBuilder.andWhere('subscriber.naturalPersonId = :naturalPersonId', {
        naturalPersonId: naturalPerson.naturalPersonId,
      });
    } else {
      // Si no encontró naturalPerson, buscar subscriber por username
      queryBuilder.andWhere('subscriber.username = :term', { term });
    }
    const subscriber = await queryBuilder.getOne();
    // Caso 1: Encontró naturalPerson y subscriber
    if (naturalPerson && subscriber)
      return formatSubscriberByTermResponse(subscriber, naturalPerson);
    // Caso 2: Encontró naturalPerson pero NO subscriber
    if (naturalPerson && !subscriber)
      return {
        subscriber: null,
        naturalPerson,
        isAssignedToService: false,
      };
    // Caso 3: NO encontró naturalPerson pero SÍ subscriber (búsqueda por username)
    if (!naturalPerson && subscriber)
      return formatSubscriberByTermResponse(subscriber);
    // Caso 4: No encontró nada
    throw new RpcException({
      status: HttpStatus.NOT_FOUND,
      message: `No se encontró ningún usuario ni persona natural registrada con el término: ${term}`,
    });
  }
}
