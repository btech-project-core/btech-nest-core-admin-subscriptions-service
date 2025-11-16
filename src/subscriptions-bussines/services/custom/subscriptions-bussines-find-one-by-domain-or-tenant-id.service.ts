import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { SubscriptionsBussine } from '../../entities/subscriptions-bussine.entity';

@Injectable()
export class SubscriptionsBussinesFindOneByDomainOrTenantIdService {
  constructor(
    @InjectRepository(SubscriptionsBussine)
    private readonly subscriptionsBussinesRepository: Repository<SubscriptionsBussine>,
  ) {}

  async execute(domain: string): Promise<SubscriptionsBussine> {
    const result = await this.subscriptionsBussinesRepository
      .createQueryBuilder('subscriptionBussine')
      .innerJoin('subscriptionBussine.subscriptionDetail', 'subscriptionDetail')
      .leftJoinAndSelect(
        'subscriptionDetail.subscriptionDetailFeatures',
        'subscriptionDetailFeatures',
      )
      .leftJoinAndSelect(
        'subscriptionDetailFeatures.subscriptionFeatures',
        'subscriptionFeatures',
      )
      .where(
        'subscriptionDetail.subscriptionDetailId = :subscriptionDetailId',
        { subscriptionDetailId: domain },
      )
      .orWhere(
        'subscriptionFeatures.code = :code AND subscriptionDetailFeatures.value = :domain',
        { code: 'DOM', domain: domain },
      )
      .getOne();
    if (!result)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `No se aprobó el registro para el dominio o tenantId: ${domain}`,
      });
    return result;
  }
}
