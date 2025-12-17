import { IsNotEmpty, IsString } from 'class-validator';
import { FindByDocumentNumberNaturalPersonResponseDto } from 'src/common/dto/find-by-document-number-natural-person.dto';

export class FindOneSubscriberByTermDto {
  @IsNotEmpty({ message: 'El ID del detalle de suscripción es requerido' })
  @IsString({
    message: 'El ID del detalle de suscripción debe ser un texto válido',
  })
  subscriptionDetailId: string;

  @IsNotEmpty({ message: 'El término de búsqueda es requerido' })
  @IsString({ message: 'El término de búsqueda debe ser un texto válido' })
  term: string;

  @IsNotEmpty({ message: 'El ID de la empresa de suscripción es requerido' })
  @IsString({
    message: 'El ID de la empresa de suscripción debe ser un texto válido',
  })
  subscriptionBussineId: string;
}

class SubscriberDataDto {
  subscriberId: string;
  username: string;
  isConfirm: boolean;
  isActive: boolean;
  hasPassword: boolean;
  isTwoFactorEnabled: boolean;
}

export class FindOneSubscriberByTermResponseDto {
  subscriber: SubscriberDataDto | null;
  naturalPerson: FindByDocumentNumberNaturalPersonResponseDto;
  isAssignedToService?: boolean;
}
