import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateSubscriptionDetailDesigneModeDto {
  @IsUUID('all', {
    message: 'El campo subscriptionDetailId debe ser un UUID válido.',
  })
  @IsNotEmpty({
    message: 'El campo subscriptionDetailId no puede estar vacío.',
  })
  subscriptionDetailId: string;

  @IsUUID('all', {
    message: 'El campo designerModeId debe ser un UUID válido.',
  })
  @IsNotEmpty({ message: 'El campo designerModeId no puede estar vacío.' })
  designerModeId: string;

  @IsBoolean({ message: 'El campo isPrimary debe ser un booleano.' })
  @IsOptional()
  isPrimary?: boolean;

  @IsBoolean({ message: 'El campo isActive debe ser un booleano.' })
  @IsOptional()
  isActive?: boolean;
}
