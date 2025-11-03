import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateParentCompanyUserDto {
  @IsNotEmpty({ message: 'El personId es requerido' })
  @IsString({ message: 'El personId debe ser un texto válido' })
  personId: string;

  @IsNotEmpty({ message: 'El subscriptionBussineId es requerido' })
  @IsString({ message: 'El subscriptionBussineId debe ser un texto válido' })
  subscriptionBussineId: string;
}

export class ValidateParentCompanyUserResponseDto {
  isParentCompanyUser: boolean;
  parentSubscriptionBussineId: string | null;
}
