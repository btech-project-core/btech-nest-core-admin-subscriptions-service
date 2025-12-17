import { Subscriber } from '../entities/subscriber.entity';
import { FindOneSubscriberByTermResponseDto } from '../dto/find-one-subscriber-by-term.dto';
import { FindByDocumentNumberNaturalPersonResponseDto } from 'src/common/dto/find-by-document-number-natural-person.dto';

export const formatSubscriberByTermResponse = (
  subscriber: Subscriber,
  naturalPersonOverride?: FindByDocumentNumberNaturalPersonResponseDto,
): FindOneSubscriberByTermResponseDto => {
  let naturalPerson =
    naturalPersonOverride ||
    (subscriber.metadata as FindByDocumentNumberNaturalPersonResponseDto) ||
    null;
  // Transformar isActive de 1/0 a true/false si viene de metadata
  if (naturalPerson && naturalPerson.person)
    naturalPerson = {
      ...naturalPerson,
      person: {
        ...naturalPerson.person,
        isActive: !!naturalPerson.person.isActive,
      },
    };
  return {
    subscriber: {
      subscriberId: subscriber.subscriberId,
      username: subscriber.username,
      isConfirm: subscriber.isConfirm,
      isActive: subscriber.isActive,
      hasPassword: !!subscriber.password,
      isTwoFactorEnabled: subscriber.isTwoFactorEnabled,
    },
    naturalPerson,
  };
};
