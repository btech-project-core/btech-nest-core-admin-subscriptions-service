import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateSubscriberDto {
  @IsString({ message: 'El subscriberId debe ser un texto válido' })
  @IsNotEmpty({ message: 'El subscriberId es requerido' })
  subscriberId: string;

  @IsString({ message: 'El subscriptionDetailId debe ser un texto válido' })
  @IsNotEmpty({ message: 'El subscriptionDetailId es requerido' })
  subscriptionDetailId: string;

  @IsString({ message: 'El subscriptionBussineId debe ser un texto válido' })
  @IsNotEmpty({ message: 'El subscriptionBussineId es requerido' })
  subscriptionBussineId: string;

  @IsOptional()
  @IsString({ message: 'El nombre de usuario debe ser un texto válido' })
  @Length(1, 15, {
    message: 'El nombre de usuario debe tener entre 1 y 15 caracteres',
  })
  username?: string;

  @IsOptional()
  @IsString({ message: 'La contraseña debe ser un texto válido' })
  password?: string;

  @IsOptional()
  @IsBoolean({ message: 'El campo isConfirm debe ser un booleano' })
  isConfirm?: boolean;

  @IsOptional()
  @IsString({ message: 'El código de servicio debe ser un texto válido' })
  service?: string;

  @IsOptional()
  @IsString({ message: 'La dirección IP debe ser un texto válido' })
  ipAddress?: string;

  @IsOptional()
  @IsString({ message: 'El user agent debe ser un texto válido' })
  userAgent?: string;
}

export class UpdateSubscriberResponseDto {
  subscriberId: string;
  username: string;
  isConfirm: boolean;
  hasPassword: boolean;
  isTwoFactorEnabled: boolean;
}
