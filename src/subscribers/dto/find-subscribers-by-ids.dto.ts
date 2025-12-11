import { IsArray, IsNotEmpty, IsString, ArrayMinSize } from 'class-validator';

export class FindSubscribersByIdsDto {
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
