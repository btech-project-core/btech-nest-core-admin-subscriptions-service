import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionsBussine } from 'src/subscriptions-bussines/entities';
import { Brackets, Repository } from 'typeorm';
import {
  FindAllSubscriptionsBussineDto,
  FindAllSubscriptionsBussineResponseDto,
} from '../../dto/find-all-subscriptions-bussine.dto';
import { PaginationResponseDto } from 'src/common/dto';
import { paginateQueryBuilder } from 'src/common/helpers/paginate-query-builder.helper';
import { formatSubscriptionsBussineResponse } from '../../helpers';

@Injectable()
export class SubscriptionsBussinesFindAllService {
  constructor(
    @InjectRepository(SubscriptionsBussine)
    private readonly subscriptionsBussineRepository: Repository<SubscriptionsBussine>,
  ) {}
  async execute(
    findAllSubscriptionsBussineDto: FindAllSubscriptionsBussineDto,
  ): Promise<
    | PaginationResponseDto<FindAllSubscriptionsBussineResponseDto>
    | FindAllSubscriptionsBussineResponseDto[]
  > {
    const { term, hasPagination, status, service, ...paginationDto } =
      findAllSubscriptionsBussineDto;
    const queryBuilder = this.subscriptionsBussineRepository
      .createQueryBuilder('subscriptionsBussine')
      .leftJoinAndSelect('subscriptionsBussine.subscription', 'subscription');

    if (service)
      queryBuilder
        .leftJoin(
          'subscriptionsBussine.subscriptionDetail',
          'subscriptionDetail',
        )
        .leftJoin(
          'subscriptionDetail.subscriptionsService',
          'subscriptionsService',
        )
        .andWhere('subscriptionsService.code = :service', { service })
        .distinct(true);

    if (term) {
      const searchTerm = `%${term}%`;
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(
            "LOWER(JSON_EXTRACT(subscriptionsBussine.personData, '$.person.documentNumber')) LIKE LOWER(:term)",
            { term: searchTerm },
          )
            .orWhere(
              "LOWER(JSON_EXTRACT(subscriptionsBussine.personData, '$.legalName')) LIKE LOWER(:term)",
              { term: searchTerm },
            )
            .orWhere(
              "LOWER(JSON_EXTRACT(subscriptionsBussine.personData, '$.comercialName')) LIKE LOWER(:term)",
              { term: searchTerm },
            );
        }),
      );
    }
    if (status)
      queryBuilder.andWhere('subscription.status = :status', {
        status,
      });
    queryBuilder.orderBy('subscriptionsBussine.createdAt', 'DESC');
    if (hasPagination) {
      const paginatedResult = await paginateQueryBuilder(
        queryBuilder,
        paginationDto,
      );
      return {
        ...paginatedResult,
        data: paginatedResult.data.map((subscriptionBussine) =>
          formatSubscriptionsBussineResponse(subscriptionBussine),
        ),
      };
    }
    const subscriptionsBussines = await queryBuilder.getMany();
    return subscriptionsBussines.map(formatSubscriptionsBussineResponse);
  }
}
