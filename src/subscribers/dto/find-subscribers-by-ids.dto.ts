import {
  IsArray,
  IsNotEmpty,
  IsString,
  ArrayMinSize,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { PaginationDto } from 'src/common/dto';

export class FindSubscribersByIdsDto extends PaginationDto {
  @IsNotEmpty({ message: 'Los IDs de subscribers son requeridos' })
  @IsArray({ message: 'Los IDs de subscribers deben ser un arreglo' })
  @ArrayMinSize(1, {
    message: 'Debe proporcionar al menos un ID de subscriber',
  })
  @IsString({
    each: true,
    message: 'Cada ID de subscriber debe ser un texto válido',
  })
  subscriberIds: string[];

  @IsOptional()
  @IsString({ message: 'El término de búsqueda debe ser un texto válido' })
  term?: string;

  @IsOptional()
  @IsBoolean({ message: 'hasPagination debe ser un booleano' })
  hasPagination?: boolean;
}

export class FindSubscribersByIdsResponseDto {
  subscriberId: string;
  username: string;
  naturalPersonId: string;
  fullName: string;
  paternalSurname: string;
  maternalSurname: string;
  documentNumber: string;
}
