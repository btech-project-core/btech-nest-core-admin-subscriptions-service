import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Subscriber } from '../../entities';
import { FindByNaturalPersonIdResponseDto } from '../../dto';
import { formatFindByNaturalPersonIdResponse } from '../../helpers';
import { CodeService } from 'src/common/enums';

@Injectable()
export class SubscribersFindByNaturalPersonIdService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
  ) {}

  async execute(
    naturalPersonId: string,
    service: CodeService,
  ): Promise<FindByNaturalPersonIdResponseDto> {
    // First, find the subscriber by naturalPersonId without service filter
    const subscriber = await this.subscriberRepository.findOne({
      where: { naturalPersonId },
      select: ['subscriberId', 'username', 'isTwoFactorEnabled', 'password'],
    });

    if (!subscriber) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'Suscriptor no encontrado',
      });
    }

    // Then, check if the subscriber is assigned to the specific service
    const queryBuilder =
      this.subscriberRepository.createQueryBuilder('subscriber');
    queryBuilder
      .leftJoinAndSelect(
        'subscriber.subscriptionsBussine',
        'subscriptionsBussine',
      )
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
      .where('subscriber.naturalPersonId = :naturalPersonId', {
        naturalPersonId,
      })
      .andWhere('subscribersSubscriptionDetails.isActive = :isActive', {
        isActive: true,
      })
      .andWhere('subscriberRoles.isActive = :roleActive', {
        roleActive: true,
      })
      .andWhere('subscriptionsService.code = :service', { service })
      .andWhere(
        'subscribersSubscriptionDetails.subscriptionDetail = subscriptionDetail.subscriptionDetailId',
      );

    const subscriberWithService = await queryBuilder.getOne();

    return formatFindByNaturalPersonIdResponse(
      subscriberWithService || subscriber,
      !!subscriberWithService,
    );
  }
}
