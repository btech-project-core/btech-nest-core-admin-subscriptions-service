import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto';

export class FindAllSubscriptionDetailDto extends PaginationDto {
  @IsOptional()
  @IsString({ message: 'El subscriptionBussineId debe ser un string' })
  subscriptionBussineId?: string;

  @IsOptional()
  @IsBoolean({ message: 'La paginación debe ser un valor booleano' })
  hasPagination?: boolean;
}

export class FindAllSubscriptionDetailResponseDto {
  subscriptionDetailId: string;
  initialDate: Date;
  finalDate: Date;
  subscriptionServiceId: string;
  subscriptionServiceData: {
    code: string;
    description: string;
  };
}
