import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DesignerMode } from 'src/designe-mode/entities/designe-mode.entity';
import {
  FindAllDesigneModeDto,
  FindAllDesigneModeResponseDto,
} from 'src/designe-mode/dto/find-all-designe-mode.dto';
import { formatDesigneModeResponse } from 'src/designe-mode/helpers/format-designe-mode-response.helper';
import { paginateQueryBuilder } from 'src/common/helpers/paginate-query-builder.helper';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class DesigneModeFindAllService {
  constructor(
    @InjectRepository(DesignerMode)
    private readonly designerModeRepository: Repository<DesignerMode>,
  ) {}

  async execute(
    findAllDesigneModeDto: FindAllDesigneModeDto,
  ): Promise<
    | FindAllDesigneModeResponseDto[]
    | PaginationResponseDto<FindAllDesigneModeResponseDto>
  > {
    const {
      term,
      isActive,
      subscriptionDetailId,
      hasPagination = true,
      ...paginationDto
    } = findAllDesigneModeDto;
    const queryBuilder =
      this.designerModeRepository.createQueryBuilder('designerMode');

    if (term)
      queryBuilder.andWhere(
        '(designerMode.description LIKE :term OR designerMode.code LIKE :term)',
        { term: `%${term}%` },
      );
    if (typeof isActive === 'boolean')
      queryBuilder.andWhere('designerMode.isActive = :isActive', {
        isActive,
      });
    if (subscriptionDetailId)
      queryBuilder.andWhere(
        'designerMode.subscriptionDetailId = :subscriptionDetailId',
        { subscriptionDetailId },
      );
    queryBuilder.orderBy('designerMode.createdAt', 'DESC');

    if (hasPagination) {
      const paginatedResult = await paginateQueryBuilder(
        queryBuilder,
        paginationDto,
      );
      return {
        ...paginatedResult,
        data: paginatedResult.data.map((data) =>
          formatDesigneModeResponse(data),
        ),
      };
    }
    const designerModes = await queryBuilder.getMany();
    return designerModes.map(formatDesigneModeResponse);
  }
}
