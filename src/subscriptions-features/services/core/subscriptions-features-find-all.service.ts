import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  FindAllSubscriptionFeaturesDto,
  FindAllSubscriptionFeaturesResponseDto,
} from '../../dto/find-all-subscription-features.dto';
import { formatSubscriptionFeaturesResponse } from '../../helpers/format-subscription-features-response.helper';
import { paginateQueryBuilder } from 'src/common/helpers/paginate-query-builder.helper';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import { SubscriptionFeatures } from '../../entities/subscription-features.entity';

@Injectable()
export class SubscriptionsFeaturesFindAllService {
  constructor(
    @InjectRepository(SubscriptionFeatures)
    private readonly subscriptionFeaturesRepository: Repository<SubscriptionFeatures>,
  ) {}

  async execute(
    findAllSubscriptionFeaturesDto: FindAllSubscriptionFeaturesDto,
  ): Promise<
    | FindAllSubscriptionFeaturesResponseDto[]
    | PaginationResponseDto<FindAllSubscriptionFeaturesResponseDto>
  > {
    const {
      term,
      isRequired,
      isActive,
      subscriptionDetailId,
      hasPagination = true,
      ...paginationDto
    } = findAllSubscriptionFeaturesDto;
    const queryBuilder = this.subscriptionFeaturesRepository.createQueryBuilder(
      'subscriptionFeatures',
    );

    if (term)
      queryBuilder.andWhere(
        '(subscriptionFeatures.description LIKE :term OR subscriptionFeatures.code LIKE :term)',
        { term: `%${term}%` },
      );
    if (typeof isRequired === 'boolean')
      queryBuilder.andWhere('subscriptionFeatures.isRequired = :isRequired', {
        isRequired,
      });
    if (typeof isActive === 'boolean')
      queryBuilder.andWhere('subscriptionFeatures.isActive = :isActive', {
        isActive,
      });
    if (subscriptionDetailId)
      queryBuilder.andWhere(
        'subscriptionFeatures.subscriptionDetailId = :subscriptionDetailId',
        { subscriptionDetailId },
      );
    queryBuilder.orderBy('subscriptionFeatures.createdAt', 'DESC');

    if (hasPagination) {
      const paginatedResult = await paginateQueryBuilder(
        queryBuilder,
        paginationDto,
      );
      return {
        ...paginatedResult,
        data: paginatedResult.data.map((data) =>
          formatSubscriptionFeaturesResponse(data),
        ),
      };
    }
    const subscriptionFeatures = await queryBuilder.getMany();
    return subscriptionFeatures.map(formatSubscriptionFeaturesResponse);
  }
}
