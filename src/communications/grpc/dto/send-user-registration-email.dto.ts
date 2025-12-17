import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class GrpcMetadataDto {
  @IsOptional()
  @IsString({ message: 'La dirección IP debe ser una cadena de texto' })
  ipAddress?: string;

  @IsOptional()
  @IsString({ message: 'El user agent debe ser una cadena de texto' })
  userAgent?: string;

  @IsOptional()
  @IsString({ message: 'El subscriber ID debe ser una cadena de texto' })
  subscriberId?: string;
}

export class SendUserRegistrationEmailDto {
  @IsEmail(
    {},
    { message: 'El correo electrónico debe tener un formato válido' },
  )
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email: string;

  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  username: string;

  @IsString({ message: 'El nombre completo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  fullName: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;

  @IsString({ message: 'El rol debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El rol es obligatorio' })
  role: string;

  @IsString({ message: 'El código de servicio debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código de servicio es obligatorio' })
  codeService: string;

  @IsString({ message: 'El nombre de la empresa debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre de la empresa es obligatorio' })
  companyName: string;

  @IsString({ message: 'El color primario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El color primario es obligatorio' })
  primaryColor: string;

  @IsString({ message: 'La URL del logo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La URL del logo es obligatoria' })
  logoUrl: string;

  @IsOptional()
  @IsString({
    message: 'El subscription detail ID debe ser una cadena de texto',
  })
  subscriptionDetailId?: string;

  @IsOptional()
  grpcMetadata?: GrpcMetadataDto;
}
