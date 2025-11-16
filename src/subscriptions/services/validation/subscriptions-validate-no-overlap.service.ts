import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Subscription } from '../../entities/subscription.entity';

@Injectable()
export class SubscriptionsValidateNoOverlapService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
  ) {}

  async execute(
    personId: string,
    initialDate: string,
    finalDate: string,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(Subscription)
      : this.subscriptionsRepository;

    const startDate = new Date(initialDate);
    const endDate = new Date(finalDate);
    const overlappingSubscriptions = await repository
      .createQueryBuilder('subscription')
      .where('subscription.personId = :personId', { personId })
      .andWhere('subscription.status IN (:...statuses)', {
        statuses: ['ACTIVE', 'PENDING'],
      })
      .andWhere('subscription.initialDate <= :endDate', { endDate })
      .andWhere('subscription.finalDate >= :startDate', { startDate })
      .getCount();

    if (overlappingSubscriptions > 0)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `No se puede crear la suscripción porque las fechas se solapan con ${overlappingSubscriptions} suscripción(es) existente(s) para esta persona`,
      });
  }
}
