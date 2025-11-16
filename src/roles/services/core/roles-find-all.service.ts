import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../entities/role.entity';
import {
  FindAllRoleDto,
  FindAllRoleResponseDto,
} from '../../dto/find-all-role.dto';
import { formatRoleResponse } from '../../helpers/format-role-response.helper';
import { paginateQueryBuilder } from 'src/common/helpers/paginate-query-builder.helper';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class RolesFindAllService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async execute(
    findAllRoleDto: FindAllRoleDto,
  ): Promise<
    FindAllRoleResponseDto[] | PaginationResponseDto<FindAllRoleResponseDto>
  > {
    const {
      term,
      isActive,
      hasPagination = true,
      subscriptionBussineId,
      subscriptionDetailId,
      ...paginationDto
    } = findAllRoleDto;
    const queryBuilder = this.roleRepository.createQueryBuilder('role');
    if (subscriptionBussineId)
      queryBuilder.andWhere(
        'role.subscriptionBussineId = :subscriptionBussineId',
        {
          subscriptionBussineId,
        },
      );
    if (subscriptionDetailId)
      queryBuilder
        .innerJoin('role.roleSubscriptionDetails', 'roleSubscriptionDetail')
        .andWhere(
          'roleSubscriptionDetail.subscriptionDetailId = :subscriptionDetailId',
          {
            subscriptionDetailId,
          },
        )
        .andWhere(
          'roleSubscriptionDetail.isActive = :roleSubscriptionDetailActive',
          {
            roleSubscriptionDetailActive: true,
          },
        );
    if (term)
      queryBuilder.andWhere(
        '(role.description LIKE :term OR role.code LIKE :term)',
        { term: `%${term}%` },
      );
    if (typeof isActive === 'boolean')
      queryBuilder.andWhere('role.isActive = :isActive', {
        isActive,
      });
    queryBuilder.orderBy('role.createdAt', 'DESC');

    if (hasPagination) {
      const paginatedResult = await paginateQueryBuilder(
        queryBuilder,
        paginationDto,
      );
      return {
        ...paginatedResult,
        data: paginatedResult.data.map((data) => formatRoleResponse(data)),
      };
    }
    const roles = await queryBuilder.getMany();
    return roles.map(formatRoleResponse);
  }
}
