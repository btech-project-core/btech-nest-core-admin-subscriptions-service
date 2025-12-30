import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SubscriberBulkItemDto {
  @IsString({ message: 'El naturalPersonId debe ser un texto válido' })
  @IsNotEmpty({ message: 'El naturalPersonId es requerido' })
  @IsUUID('all', { message: 'El naturalPersonId debe ser un UUID válido' })
  naturalPersonId: string;

  @IsString({ message: 'El username debe ser un texto válido' })
  @IsNotEmpty({ message: 'El username es requerido' })
  username: string;

  @IsString({ message: 'La metadata debe ser un texto válido' })
  @IsNotEmpty({ message: 'La metadata es requerida' })
  metadata: string;
}

export class CreateSubscribersBulkFromNaturalPersonsDto {
  @IsArray({ message: 'subscribers debe ser un array' })
  @ArrayMinSize(1, { message: 'Debe proporcionar al menos un subscriber' })
  @ValidateNested({ each: true })
  @Type(() => SubscriberBulkItemDto)
  subscribers: SubscriberBulkItemDto[];

  @IsNotEmpty({
    message: 'El ID del detalle de suscripción es un campo obligatorio',
  })
  @IsUUID('all', {
    message: 'El ID del detalle de suscripción debe ser un UUID válido',
  })
  subscriptionDetailId: string;

  @IsNotEmpty({
    message: 'El ID del negocio de suscripción es un campo obligatorio',
  })
  @IsUUID('all', {
    message: 'El ID del negocio de suscripción debe ser un UUID válido',
  })
  subscriptionBussineId: string;
}

export class SubscriberBulkResultDto {
  @IsString()
  @IsUUID()
  subscriberId: string;

  @IsString()
  username: string;
}

export class CreateSubscribersBulkFromNaturalPersonsResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubscriberBulkResultDto)
  results: SubscriberBulkResultDto[];
}
