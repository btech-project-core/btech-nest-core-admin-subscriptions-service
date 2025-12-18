import { Subscriber } from '../entities/subscriber.entity';
import { FindOneSubscriberResponseDto } from '../dto/find-one-subscriber';

export const formatFindOneSubscriberResponse = (
  subscriber: Subscriber,
): FindOneSubscriberResponseDto => {
  return {
    subscriberId: subscriber.subscriberId,
    username: subscriber.username,
    isTwoFactorEnabled: subscriber.isTwoFactorEnabled,
    hasPassword: !!subscriber.password,
    isConfirm: subscriber.isConfirm,
  };
};
