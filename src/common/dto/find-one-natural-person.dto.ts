import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { FindOnePersonResponseDto } from './find-one-person.dto';

export class FindOneNaturalPersonDto {
  @IsUUID('all', { message: 'El id de la persona natural no es válido' })
  @IsNotEmpty({ message: 'El id de la persona natural no puede estar vacío' })
  naturalPersonId: string;

  @IsString({ message: 'El id de la empresa de suscripción no es válido' })
  @IsNotEmpty({
    message: 'El id de la empresa de suscripción no puede estar vacío',
  })
  subscriptionBussineId: string;
}

export class FindOneNaturalPersonResponseDto {
  naturalPersonId: string;
  fullName: string;
  paternalSurname: string;
  maternalSurname: string;
  subscriptionBussineId: string;
  person: FindOnePersonResponseDto;
}
