import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class UpdateSubscriberMetadataDto {
  @IsNotEmpty({ message: 'El ID de la persona natural es requerido' })
  @IsString({ message: 'El ID de la persona natural debe ser un texto válido' })
  naturalPersonId: string;

  @IsObject({
    message: 'La información de la persona natural debe ser un objeto',
  })
  @IsNotEmpty({
    message: 'La información de la persona natural no puede estar vacía',
  })
  naturalPerson: Record<string, any>;
}
