export class FindOneSubscriberResponseDto {
  subscriberId: string;
  username: string;
  isConfirm: boolean;
  isTwoFactorEnabled: boolean;
  hasPassword: boolean;
}
