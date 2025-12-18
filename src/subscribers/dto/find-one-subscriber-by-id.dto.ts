export class FindOneSubscriberByIdResponseDto {
  subscriberId: string;
  username: string;
  isConfirm?: boolean;
  url?: string;
  isTwoFactorEnabled: boolean;
  twoFactorSecret?: string | undefined;
  hashedPassword?: string | null;
}
