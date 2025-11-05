import { CodeService } from 'src/common/enums/code-service.enum';
import { StatusSubscription } from 'src/subscriptions/enums/status-subscription.enum';
import { FindOneUsernameResponseDto } from '../dto/find-one-username.dto';
import { Subscriber } from '../entities/subscriber.entity';

export const formatFindOneUsernameResponse = (
  subscriber: Subscriber,
  additionalRoles: string[] = [],
  isGlobalUser: boolean = false,
  serviceCode: CodeService,
): FindOneUsernameResponseDto => {
  const subscriberRoles =
    subscriber.subscribersSubscriptionDetails?.flatMap(
      (subDetail) =>
        subDetail.subscriberRoles?.map((role) => role.role.code) || [],
    ) || [];
  const allRoles = [...new Set([...subscriberRoles, ...additionalRoles])];

  if (isGlobalUser)
    return {
      subscriberId: subscriber.subscriberId,
      username: subscriber.username,
      isTwoFactorEnabled: subscriber.isTwoFactorEnabled,
      service: serviceCode,
      roles: allRoles,
      password: subscriber.password || undefined,
      twoFactorSecret: subscriber.twoFactorSecret || undefined,
      subscription: {
        subscriptionId: 'global',
        subscriptionBussineId: 'global',
        subscriptionDetailId: 'global',
        status: StatusSubscription.ACTIVE,
      },
    };

  return {
    subscriberId: subscriber.subscriberId,
    username: subscriber.username,
    isTwoFactorEnabled: subscriber.isTwoFactorEnabled,
    service: subscriber.subscriptionsBussine.subscriptionDetail[0]
      .subscriptionsService.code as CodeService,
    roles: allRoles,
    password: subscriber.password || undefined,
    twoFactorSecret: subscriber.twoFactorSecret || undefined,
    subscription: {
      subscriptionId:
        subscriber.subscriptionsBussine.subscription.subscriptionId,
      subscriptionBussineId:
        subscriber.subscriptionsBussine.subscriptionBussineId,
      subscriptionDetailId:
        subscriber.subscriptionsBussine.subscriptionDetail[0]
          .subscriptionDetailId,
      status: subscriber.subscriptionsBussine.subscription.status,
    },
  };
};
