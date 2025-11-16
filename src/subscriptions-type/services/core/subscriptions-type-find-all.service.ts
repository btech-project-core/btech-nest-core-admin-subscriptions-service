import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResponseDto } from 'src/common/dto';
import { paginateQueryBuilder } from 'src/common/helpers';
import {
  FindAllSubscriptionsTypeDto,
  FindAllSubscriptionsTypeResponseDto,
} from 'src/subscriptions-type/dto/find-all-subscriptions-type.dto';
import { SubscriptionsType } from 'src/subscriptions-type/entities/subscriptions-type.entity';
import { formatSubscriptionsTypeResponse } from 'src/subscriptions-type/helpers/format-subscriptions-type-response.helper';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionsTypeFindAllService {
  constructor(
    @InjectRepository(SubscriptionsType)
    private readonly subscriptionsTypeRepository: Repository<SubscriptionsType>,
  ) {}
  async execute(
    findAllSubscriptionsTypeDto: FindAllSubscriptionsTypeDto,
  ): Promise<
    | FindAllSubscriptionsTypeResponseDto[]
    | PaginationResponseDto<FindAllSubscriptionsTypeResponseDto>
  > {
    const {
      term,
      isActive,
      hasPagination = true,
      ...paginationDto
    } = findAllSubscriptionsTypeDto;
    const queryBuilder =
      this.subscriptionsTypeRepository.createQueryBuilder('subscriptionsType');

    if (term)
      queryBuilder.andWhere('subscriptionsType.description LIKE :term', {
        term: `%${term}%`,
      });
    if (typeof isActive === 'boolean')
      queryBuilder.andWhere('subscriptionsType.isActive = :isActive', {
        isActive,
      });
    queryBuilder.orderBy('subscriptionsType.createdAt', 'DESC');

    if (hasPagination) {
      const paginatedResult = await paginateQueryBuilder(
        queryBuilder,
        paginationDto,
      );
      return {
        ...paginatedResult,
        data: paginatedResult.data.map((data) =>
          formatSubscriptionsTypeResponse(data),
        ),
      };
    }
    const subscriptionsTypes = await queryBuilder.getMany();
    return subscriptionsTypes.map(formatSubscriptionsTypeResponse);
  }
}
