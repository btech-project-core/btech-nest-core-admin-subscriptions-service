import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionsService } from '../../entities/subscriptions-service.entity';
import { Brackets, Repository } from 'typeorm';
import {
  FindAllSubscriptionsServiceDto,
  FindAllSubscriptionsServiceResponseDto,
} from '../../dto/find-all-subscription-service.dto';
import { formatSubscriptionsServiceResponse } from '../../helpers/format-subscriptions-service-response.helper';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import { paginateQueryBuilder } from 'src/common/helpers/paginate-query-builder.helper';

@Injectable()
export class SubscriptionsServicesFindAllService {
  constructor(
    @InjectRepository(SubscriptionsService)
    private readonly subscriptionsServicesRepository: Repository<SubscriptionsService>,
  ) {}

  async execute(
    findAllSubscriptionsServiceDto: FindAllSubscriptionsServiceDto,
  ): Promise<
    | FindAllSubscriptionsServiceResponseDto[]
    | PaginationResponseDto<FindAllSubscriptionsServiceResponseDto>
  > {
    const {
      term,
      isActive,
      hasPagination = true,
      ...paginationDto
    } = findAllSubscriptionsServiceDto;
    const queryBuilder =
      this.subscriptionsServicesRepository.createQueryBuilder(
        'subscriptionsService',
      );
    if (term)
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('subscriptionsService.code LIKE :term', {
            term: `%${term}%`,
          }).orWhere('subscriptionsService.description LIKE :term', {
            term: `%${term}%`,
          });
        }),
      );
    if (typeof isActive === 'boolean')
      queryBuilder.andWhere('subscriptionsService.isActive = :isActive', {
        isActive,
      });
    queryBuilder.orderBy('subscriptionsService.createdAt', 'DESC');
    if (hasPagination) {
      const paginatedResult = await paginateQueryBuilder(
        queryBuilder,
        paginationDto,
      );
      return {
        ...paginatedResult,
        data: paginatedResult.data.map((data) =>
          formatSubscriptionsServiceResponse(data),
        ),
      };
    }
    const subscriptionsServices = await queryBuilder.getMany();
    return subscriptionsServices.map(formatSubscriptionsServiceResponse);
  }
}
