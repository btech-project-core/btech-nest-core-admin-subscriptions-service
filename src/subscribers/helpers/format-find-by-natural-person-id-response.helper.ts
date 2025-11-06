import { Subscriber } from '../entities/subscriber.entity';
import { FindByNaturalPersonIdResponseDto } from '../dto';

export const formatFindByNaturalPersonIdResponse = (
  subscriber: Subscriber,
): FindByNaturalPersonIdResponseDto => {
  const roles =
    subscriber.subscribersSubscriptionDetails?.flatMap(
      (subDetail) =>
        subDetail.subscriberRoles?.map((role) => role.role.code) || [],
    ) || [];

  return {
    subscriberId: subscriber.subscriberId,
    username: subscriber.username,
    isTwoFactorEnabled: subscriber.isTwoFactorEnabled,
    roles: roles,
    hasPassword: subscriber.password !== null,
  };
};
