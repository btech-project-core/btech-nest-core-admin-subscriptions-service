import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../../entities/subscription.entity';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import { FindAllSubscriptionDto } from '../../dto/find-all-subscription.dto';
import { paginateQueryBuilder } from 'src/common/helpers/paginate-query-builder.helper';

@Injectable()
export class SubscriptionsFindAllService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
  ) {}

  async execute(
    findAllSubscriptionDto: FindAllSubscriptionDto,
  ): Promise<PaginationResponseDto<Subscription>> {
    const {
      page = 1,
      limit = 8,
      status,
      startDate,
      endDate,
    } = findAllSubscriptionDto;
    const queryBuilder = this.subscriptionsRepository
      .createQueryBuilder('subscription')
      .leftJoinAndSelect(
        'subscription.subscriptionsBussine',
        'subscriptionsBussine',
      );
    if (status)
      queryBuilder.andWhere('subscription.status = :status', { status });
    if (startDate)
      queryBuilder.andWhere('subscription.initialDate >= :startDate', {
        startDate,
      });
    if (endDate)
      queryBuilder.andWhere('subscription.initialDate <= :endDate', {
        endDate,
      });
    queryBuilder.orderBy('subscription.createdAt', 'DESC');
    return await paginateQueryBuilder(queryBuilder, {
      page,
      limit,
    });
  }
}
