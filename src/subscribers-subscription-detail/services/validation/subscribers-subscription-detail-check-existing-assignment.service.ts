import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { SubscribersSubscriptionDetail } from '../../entities/subscribers-subscription-detail.entity';

@Injectable()
export class SubscribersSubscriptionDetailCheckExistingAssignmentService {
  constructor(
    @InjectRepository(SubscribersSubscriptionDetail)
    private readonly subscribersSubscriptionDetailRepository: Repository<SubscribersSubscriptionDetail>,
  ) {}

  async execute(
    subscriberId: string,
    subscriptionDetailId: string,
    roleCode: string,
  ): Promise<SubscribersSubscriptionDetail | null> {
    const existingAssignment =
      await this.subscribersSubscriptionDetailRepository.findOne({
        where: {
          subscriber: { subscriberId },
          subscriptionDetail: { subscriptionDetailId },
        },
        relations: ['subscriberRoles', 'subscriberRoles.role'],
      });

    if (existingAssignment) {
      const hasRole = existingAssignment.subscriberRoles?.some(
        (sr) => sr.role.code === roleCode && sr.isActive,
      );

      if (hasRole) {
        throw new RpcException({
          status: HttpStatus.CONFLICT,
          message: `El suscriptor ya está asignado al servicio con el rol '${roleCode}'`,
        });
      }
    }

    return existingAssignment;
  }
}
