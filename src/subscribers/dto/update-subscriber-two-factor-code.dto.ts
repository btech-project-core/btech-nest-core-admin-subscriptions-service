import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserProfileResponseDto } from 'src/common/dto';

export class UpdateSubscriberTwoFactorCodeDto {
  @IsString({ message: 'El subscriberId debe ser un texto válido' })
  @IsNotEmpty({ message: 'El subscriberId es requerido' })
  subscriberId: string;

  @IsOptional()
  @IsString({ message: 'El twoFactorSecret es un texto' })
  twoFactorSecret?: string | null;

  @IsBoolean({ message: 'El isTwoFactorEnabled es un booleano' })
  @IsOptional()
  isTwoFactorEnabled?: boolean;
}

export class UpdateSubscriberTwoFactorCodeResponseDto extends UserProfileResponseDto {}
