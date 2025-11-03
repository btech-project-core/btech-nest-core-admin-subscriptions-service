import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ValidateParentAndGetBusinessesDto {
  @IsNotEmpty({ message: 'El subscriptionBussineId es requerido' })
  @IsUUID('4', { message: 'El subscriptionBussineId debe ser un UUID válido' })
  @IsString({ message: 'El subscriptionBussineId debe ser un texto válido' })
  subscriptionBussineId: string;

  @IsNotEmpty({ message: 'El personId es requerido' })
  @IsUUID('4', { message: 'El personId debe ser un UUID válido' })
  @IsString({ message: 'El personId debe ser un texto válido' })
  personId: string;
}

export class ValidateParentAndGetBusinessesResponseDto {
  isParent: boolean;
  subscriptionBussineIds?: string[];
}
