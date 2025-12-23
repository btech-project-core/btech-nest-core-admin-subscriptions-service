import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto';
import { StatusSubscription } from 'src/subscriptions/enums';
import { CodeService } from 'src/common/enums/code-service.enum';

export class FindAllSubscriptionsBussineDto extends PaginationDto {
  @IsOptional()
  @IsString({ message: 'El término de búsqueda no puede estar vacío' })
  term?: string;

  @IsOptional()
  @IsBoolean({ message: 'La paginación debe ser un valor booleano' })
  hasPagination?: boolean;

  @IsOptional()
  @IsString({ message: 'El estado de la suscripción no puede estar vacío' })
  status?: StatusSubscription;

  @IsOptional()
  @IsEnum(CodeService, {
    message: 'El código de servicio debe ser un valor válido',
  })
  service?: CodeService;
}

export class FindAllSubscriptionsBussineResponseDto {
  subscriptionBussineId: string;
  initialDate: Date;
  finalDate: Date;
  personId: string;
  personData: Record<string, any>;
  status: StatusSubscription;
}
