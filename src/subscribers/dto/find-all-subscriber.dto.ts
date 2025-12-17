import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FindOneNaturalPersonResponseDto } from 'src/common/dto/find-one-natural-person.dto';

export class FindAllSubscriberDto extends PaginationDto {
  @IsNotEmpty({ message: 'El ID del detalle de suscripción es requerido' })
  @IsString({
    message: 'El ID del detalle de suscripción debe ser un texto válido',
  })
  subscriptionDetailId: string;

  @IsNotEmpty({ message: 'El término de búsqueda es requerido' })
  @IsString({ message: 'El término de búsqueda debe ser un texto válido' })
  @MinLength(4, {
    message: 'El término de búsqueda debe tener al menos 4 caracteres',
  })
  term: string;

  @IsOptional()
  @IsBoolean({
    message: 'El estado de confirmación debe ser un valor booleano',
  })
  isConfirm?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  isActive?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'La paginación debe ser un valor booleano' })
  hasPagination?: boolean;
}

export class FindAllSubscriberResponseDto {
  subscriberId: string;
  username: string;
  isConfirm: boolean;
  isActive: boolean;
  naturalPerson: FindOneNaturalPersonResponseDto | null;
  roles: string[];
  hasPassword?: boolean;
  isTwoFactorEnabled?: boolean;
  createdAt: Date;
}
