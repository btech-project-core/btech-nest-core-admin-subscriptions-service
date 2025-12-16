import { Subscriber } from '../entities/subscriber.entity';
import { FindAllSubscriberResponseDto } from '../dto/find-all-subscriber.dto';
import { FindOneNaturalPersonResponseDto } from 'src/common/dto/find-one-natural-person.dto';

export const formatSubscriberResponse = (
  subscriber: Subscriber,
): FindAllSubscriberResponseDto => {
  const naturalPerson =
    (subscriber.metadata as FindOneNaturalPersonResponseDto) || null;
  const roles =
    subscriber.subscribersSubscriptionDetails?.flatMap((ssd) =>
      ssd.subscriberRoles?.map((sr) => sr.role.code),
    ) || [];

  return {
    subscriberId: subscriber.subscriberId,
    username: subscriber.username,
    isConfirm: subscriber.isConfirm,
    isActive: subscriber.isActive,
    hasPassword: !!subscriber.password,
    isTwoFactorEnabled: subscriber.isTwoFactorEnabled,
    naturalPerson: naturalPerson,
    roles: roles,
    createdAt: subscriber.createdAt,
  };
};
