import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionDetail } from '../../entities/subscription-detail.entity';
import {
  FindAllSubscriptionDetailDto,
  FindAllSubscriptionDetailResponseDto,
} from '../../dto/find-all-subscription-detail.dto';
import { PaginationResponseDto } from 'src/common/dto';
import { paginateQueryBuilder } from 'src/common/helpers/paginate-query-builder.helper';
import { formatSubscriptionDetailResponse } from '../../helpers';

@Injectable()
export class SubscriptionDetailFindAllService {
  constructor(
    @InjectRepository(SubscriptionDetail)
    private readonly subscriptionDetailRepository: Repository<SubscriptionDetail>,
  ) {}

  async execute(
    findAllSubscriptionDetailDto: FindAllSubscriptionDetailDto,
  ): Promise<
    | PaginationResponseDto<FindAllSubscriptionDetailResponseDto>
    | FindAllSubscriptionDetailResponseDto[]
  > {
    const { subscriptionBussineId, hasPagination, ...paginationDto } =
      findAllSubscriptionDetailDto;
    const queryBuilder = this.subscriptionDetailRepository
      .createQueryBuilder('subscriptionDetail')
      .leftJoinAndSelect(
        'subscriptionDetail.subscriptionsService',
        'subscriptionsService',
      )
      .leftJoinAndSelect(
        'subscriptionDetail.subscriptionsBussine',
        'subscriptionsBussine',
      )
      .where('subscriptionDetail.finalDate > :currentDate', {
        currentDate: new Date(),
      });
    if (subscriptionBussineId)
      queryBuilder.andWhere(
        'subscriptionsBussine.subscriptionBussineId = :subscriptionBussineId',
        { subscriptionBussineId },
      );
    queryBuilder.orderBy('subscriptionDetail.createdAt', 'DESC');
    if (hasPagination) {
      const paginatedResult = await paginateQueryBuilder(
        queryBuilder,
        paginationDto,
      );
      return {
        ...paginatedResult,
        data: paginatedResult.data.map((subscriptionDetail) =>
          formatSubscriptionDetailResponse(subscriptionDetail),
        ),
      };
    }
    const subscriptionDetails = await queryBuilder.getMany();
    return subscriptionDetails.map(formatSubscriptionDetailResponse);
  }
}
