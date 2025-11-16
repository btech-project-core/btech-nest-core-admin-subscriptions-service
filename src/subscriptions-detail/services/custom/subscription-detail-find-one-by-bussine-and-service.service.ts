import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusSubscription } from 'src/subscriptions/enums/status-subscription.enum';
import { SubscriptionDetail } from '../../entities/subscription-detail.entity';
import { CodeService } from 'src/common/enums/code-service.enum';
import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class SubscriptionDetailFindOneByBussineAndServiceService {
  constructor(
    @InjectRepository(SubscriptionDetail)
    private readonly subscriptionsDetailsRepository: Repository<SubscriptionDetail>,
  ) {}

  async execute(
    subscriptionBussineId: string,
    serviceCode: CodeService,
  ): Promise<SubscriptionDetail> {
    const subscriptionDetail = await this.subscriptionsDetailsRepository
      .createQueryBuilder('sd')
      .innerJoin('sd.subscriptionsBussine', 'sb')
      .innerJoin('sb.subscription', 's')
      .innerJoin('sd.subscriptionsService', 'ss')
      .where('sb.subscriptionBussineId = :subscriptionBussineId', {
        subscriptionBussineId,
      })
      .andWhere('ss.code = :serviceCode', { serviceCode })
      .andWhere('s.status = :status', { status: StatusSubscription.ACTIVE })
      .getOne();
    if (!subscriptionDetail)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `No se encontró configuración activa para el servicio ${serviceCode} en la suscripción ${subscriptionBussineId}`,
      });
    return subscriptionDetail;
  }
}
