import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class GetSubscribersByBusinessDto extends PaginationDto {
  @IsNotEmpty()
  @IsString()
  subscriptionBussineId: string;

  @IsOptional()
  @IsString()
  service?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'], { message: 'El orden debe ser ASC o DESC' })
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}

export class GetSubscribersByBusinessResponseDto {
  subscriberId: string;
  role: string[];
  fullName: string;
  paternalSurname: string;
  maternalSurname: string;
  documentNumber: string;
  documentType: string;
  createdAt: string;
  updatedAt: string;
}
