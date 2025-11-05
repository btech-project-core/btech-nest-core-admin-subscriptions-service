import { NaturalPersonResponseDto } from 'src/common/dto/natural-person.dto';
import { Subscriber } from '../entities/subscriber.entity';
import { PersonResponseDto } from 'src/common/dto/person.dto';
import { UserProfileResponseDto } from 'src/common/dto/user-profile.dto';
import { StatusSubscription } from 'src/subscriptions/enums';

export const formatSubscriberWithLoginResponse = (
  subscriber: Subscriber,
  naturalPerson: NaturalPersonResponseDto,
  subscriptionPersonData: PersonResponseDto,
  isGlobalUser: boolean = false,
): UserProfileResponseDto => {
  const roles =
    subscriber.subscribersSubscriptionDetails?.flatMap(
      (subDetail) =>
        subDetail.subscriberRoles?.map((role) => role.role.code) || [],
    ) || [];

  // Si es usuario global, agregar rol SYS
  const allRoles = isGlobalUser ? [...roles, 'SYS'] : roles;

  const baseResponse = {
    subscriberId: subscriber.subscriberId,
    username: subscriber.username,
    isTwoFactorEnabled: subscriber.isTwoFactorEnabled,
    roles: allRoles,
    hasPassword: subscriber.password !== null,
  };

  if (isGlobalUser) {
    return {
      ...baseResponse,
      naturalPerson,
      subscription: {
        subscriptionId: 'global',
        subscriptionBussineId: 'global',
        subscriptionDetailId: 'global',
        status: StatusSubscription.ACTIVE,
        initialDate: 'global',
        finalDate: 'global',
        url: 'global',
        person: subscriptionPersonData,
      },
    };
  }

  return {
    ...baseResponse,
    naturalPerson,
    subscription: {
      subscriptionId:
        subscriber.subscriptionsBussine?.subscription?.subscriptionId,
      subscriptionBussineId:
        subscriber.subscriptionsBussine?.subscriptionBussineId,
      subscriptionDetailId:
        subscriber.subscriptionsBussine?.subscriptionDetail[0]
          .subscriptionDetailId,
      status: subscriber.subscriptionsBussine?.subscription?.status,
      initialDate:
        subscriber.subscriptionsBussine?.subscription?.initialDate?.toISOString(),
      finalDate:
        subscriber.subscriptionsBussine?.subscription?.finalDate?.toISOString(),
      url: subscriber.subscriptionsBussine?.subscription?.url,
      person: subscriptionPersonData,
    },
  };
};
