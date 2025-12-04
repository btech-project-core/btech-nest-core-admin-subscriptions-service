import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class AssignSubscriberToServiceDto {
  @IsUUID('4', { message: 'El campo subscriberId debe ser un UUID válido.' })
  @IsNotEmpty({ message: 'El campo subscriberId no puede estar vacío.' })
  subscriberId: string;

  @IsUUID('4', {
    message: 'El campo subscriptionDetailId debe ser un UUID válido.',
  })
  @IsNotEmpty({
    message: 'El campo subscriptionDetailId no puede estar vacío.',
  })
  subscriptionDetailId: string;

  @IsString({ message: 'El campo roleCode debe ser una cadena de caracteres.' })
  @IsNotEmpty({ message: 'El campo roleCode no puede estar vacío.' })
  roleCode: string;
}

export class AssignSubscriberToServiceResponseDto {
  subscribersSubscriptionDetailId: string;
  subscriberRoleId: string;
  subscriberId: string;
  subscriptionDetailId: string;
  roleCode: string;
  message: string;
}
