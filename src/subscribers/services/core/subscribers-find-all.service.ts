import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Subscriber } from '../../entities/subscriber.entity';
import {
  FindAllSubscriberDto,
  FindAllSubscriberResponseDto,
} from '../../dto/find-all-subscriber.dto';
import { paginateQueryBuilder } from 'src/common/helpers/paginate-query-builder.helper';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import { formatSubscriberResponse } from '../../helpers/format-subscriber-response.helper';

@Injectable()
export class SubscribersFindAllService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
  ) {}

  async execute(
    findAllSubscriberDto: FindAllSubscriberDto,
  ): Promise<
    | FindAllSubscriberResponseDto[]
    | PaginationResponseDto<FindAllSubscriberResponseDto>
  > {
    const {
      term,
      isActive,
      isConfirm,
      hasPagination,
      subscriptionDetailId,
      ...paginationDto
    } = findAllSubscriberDto;

    const queryBuilder = this.subscriberRepository
      .createQueryBuilder('subscriber')
      .leftJoinAndSelect(
        'subscriber.subscribersSubscriptionDetails',
        'subscribersSubscriptionDetail',
      )
      .leftJoinAndSelect(
        'subscribersSubscriptionDetail.subscriberRoles',
        'subscriberRoles',
      )
      .leftJoinAndSelect('subscriberRoles.role', 'role')
      .where(
        'subscribersSubscriptionDetail.subscriptionDetailId = :subscriptionDetailId',
        { subscriptionDetailId },
      )
      .andWhere('subscribersSubscriptionDetail.isActive = :ssdIsActive', {
        ssdIsActive: true,
      });

    if (term) {
      const searchTerm = `%${term}%`;
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(subscriber.username) LIKE LOWER(:term)', {
            term: searchTerm,
          })
            .orWhere(
              "LOWER(JSON_EXTRACT(subscriber.metadata, '$.naturalPerson.fullName')) LIKE LOWER(:term)",
              { term: searchTerm },
            )
            .orWhere(
              "LOWER(JSON_EXTRACT(subscriber.metadata, '$.naturalPerson.paternalSurname')) LIKE LOWER(:term)",
              { term: searchTerm },
            )
            .orWhere(
              "LOWER(JSON_EXTRACT(subscriber.metadata, '$.naturalPerson.maternalSurname')) LIKE LOWER(:term)",
              { term: searchTerm },
            )
            .orWhere(
              "LOWER(JSON_EXTRACT(subscriber.metadata, '$.naturalPerson.documentNumber')) LIKE LOWER(:term)",
              { term: searchTerm },
            )
            .orWhere(
              "JSON_SEARCH(LOWER(subscriber.metadata), 'one', LOWER(:term), NULL, '$.naturalPerson.personInformation[*].description') IS NOT NULL",
              { term: searchTerm },
            );
        }),
      );
    }
    if (typeof isActive === 'boolean')
      queryBuilder.andWhere('subscriber.isActive = :isActive', { isActive });
    if (typeof isConfirm === 'boolean')
      queryBuilder.andWhere('subscriber.isConfirm = :isConfirm', {
        isConfirm,
      });
    queryBuilder.orderBy('subscriber.createdAt', 'DESC');
    if (hasPagination) {
      const paginatedResult = await paginateQueryBuilder(
        queryBuilder,
        paginationDto,
      );
      return {
        ...paginatedResult,
        data: paginatedResult.data.map((data) =>
          formatSubscriberResponse(data),
        ),
      };
    }
    const subscribers = await queryBuilder.getMany();
    return subscribers.map(formatSubscriberResponse);
  }
}
