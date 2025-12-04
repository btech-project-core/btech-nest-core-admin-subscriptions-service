import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CodeService } from 'src/common/enums';

export class FindByNaturalPersonIdDto {
  @IsString({
    message: 'El campo naturalPersonId debe ser una cadena de caracteres.',
  })
  @IsNotEmpty({ message: 'El campo naturalPersonId no puede estar vacío.' })
  naturalPersonId: string;

  @IsEnum(CodeService, {
    message:
      'El campo service debe ser un código de servicio válido: VDI, STO o SUP.',
  })
  @IsNotEmpty({ message: 'El campo service no puede estar vacío.' })
  service: CodeService;
}

export class FindByNaturalPersonIdResponseDto {
  subscriberId: string;
  username: string;
  isTwoFactorEnabled: boolean;
  roles: string[] | null;
  hasPassword: boolean;
  isAssignedToService: boolean;
}
