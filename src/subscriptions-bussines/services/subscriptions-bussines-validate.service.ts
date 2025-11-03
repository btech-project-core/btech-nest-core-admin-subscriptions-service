import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { SubscriptionsBussine } from '../entities/subscriptions-bussine.entity';
import { StatusSubscription } from 'src/subscriptions/enums/status-subscription.enum';
import {
  ValidateParentAndGetBusinessesDto,
  ValidateParentAndGetBusinessesResponseDto,
} from '../dto';

@Injectable()
export class SubscriptionsBussinesValidateService {
  constructor(
    @InjectRepository(SubscriptionsBussine)
    private readonly subscriptionsBussinesRepository: Repository<SubscriptionsBussine>,
  ) {}

  async checkActiveSubscriptionsByJuridicalPersonId(
    juridicalPersonId: string,
  ): Promise<boolean> {
    const activeSubscriptionsCount = await this.subscriptionsBussinesRepository
      .createQueryBuilder('subscriptionBussine')
      .innerJoin('subscriptionBussine.subscription', 'subscription')
      .innerJoin('subscription.person', 'person')
      .innerJoin('person.juridicalPerson', 'juridicalPerson')
      .where('juridicalPerson.juridicalPersonId = :juridicalPersonId', {
        juridicalPersonId,
      })
      .andWhere('subscription.status = :status', {
        status: StatusSubscription.ACTIVE,
      })
      .getCount();

    if (activeSubscriptionsCount > 0)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `No se puede proceder porque la empresa tiene ${activeSubscriptionsCount} suscripción(es) activa(s)`,
      });
    return true;
  }

  async validateParentAndGetBusinesses(
    dto: ValidateParentAndGetBusinessesDto,
  ): Promise<ValidateParentAndGetBusinessesResponseDto> {
    const { subscriptionBussineId, personId } = dto;

    // Buscar el subscriptionBussine con su subscription
    const subscriptionBussine =
      await this.subscriptionsBussinesRepository.findOne({
        where: { subscriptionBussineId },
        relations: ['subscription'],
      });

    if (!subscriptionBussine)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `No se encontró el negocio de suscripción con id: ${subscriptionBussineId}`,
      });

    // Verificar si el personId coincide con el personId del subscriptionBussine
    if (subscriptionBussine.personId !== personId)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `El personId ${personId} no coincide con el negocio de suscripción`,
      });

    // Comparar si es el padre
    const isParent =
      subscriptionBussine.personId ===
      subscriptionBussine.subscription.personId;

    // Si es padre, obtener todos los subscriptionBussineIds asociados a la subscriptionId
    if (isParent) {
      const allBusinesses = await this.subscriptionsBussinesRepository.find({
        where: {
          subscription: {
            subscriptionId: subscriptionBussine.subscription.subscriptionId,
          },
        },
        select: ['subscriptionBussineId'],
      });

      const subscriptionBussineIds = allBusinesses.map(
        (business) => business.subscriptionBussineId,
      );

      return {
        isParent: true,
        subscriptionBussineIds,
      };
    }

    // Si no es padre, solo retornar el booleano
    return {
      isParent: false,
    };
  }
}
