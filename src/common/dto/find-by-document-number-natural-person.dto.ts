import { IsNotEmpty, IsString } from 'class-validator';
import { FindOneNaturalPersonResponseDto } from './find-one-natural-person.dto';

export class FindByDocumentNumberNaturalPersonDto {
  @IsString({ message: 'El número de documento es una cadena de texto' })
  @IsNotEmpty({ message: 'El número de documento no puede estar vacío' })
  documentNumber: string;

  @IsString({ message: 'El ID de la suscripción es una cadena de texto' })
  @IsNotEmpty({ message: 'El ID de la suscripción no puede estar vacío' })
  subscriptionBussineId: string;
}

export class FindByDocumentNumberNaturalPersonResponseDto extends FindOneNaturalPersonResponseDto {}
