import { Subscriber } from '../entities/subscriber.entity';
import { FindByNaturalPersonIdResponseDto } from '../dto';

export const formatFindByNaturalPersonIdResponse = (
  subscriber: Subscriber,
  isAssignedToService: boolean,
): FindByNaturalPersonIdResponseDto => {
  const roles = isAssignedToService
    ? subscriber.subscribersSubscriptionDetails?.flatMap(
        (subDetail) =>
          subDetail.subscriberRoles?.map((role) => role.role.code) || [],
      ) || []
    : null;

  return {
    subscriberId: subscriber.subscriberId,
    username: subscriber.username,
    isTwoFactorEnabled: subscriber.isTwoFactorEnabled,
    roles: roles,
    hasPassword: subscriber.password !== null,
    isAssignedToService: isAssignedToService,
  };
};
