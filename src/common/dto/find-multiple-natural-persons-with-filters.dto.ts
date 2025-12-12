import { PaginationDto, PaginationResponseDto } from './pagination.dto';

export class FindMultipleNaturalPersonsWithFiltersDto extends PaginationDto {
  naturalPersonIds: string[];
  term?: string;
  hasPagination?: boolean;
}

export class FindMultipleNaturalPersonsWithFiltersResponseDto {
  naturalPersonId: string;
  fullName: string;
  paternalSurname: string;
  maternalSurname: string;
  documentNumber: string;
}

export type FindMultipleNaturalPersonsWithFiltersResult =
  | PaginationResponseDto<FindMultipleNaturalPersonsWithFiltersResponseDto>
  | FindMultipleNaturalPersonsWithFiltersResponseDto[];
