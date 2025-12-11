import { Subscriber } from '../entities';
import { FindSubscribersByIdsResponseDto } from '../dto/find-subscribers-by-ids.dto';
import { FindMultipleNaturalPersonsResponseDto } from 'src/common/dto';

export const formatFindSubscribersByIdsResponse = (
  subscriber: Subscriber,
  naturalPerson: FindMultipleNaturalPersonsResponseDto | undefined,
): FindSubscribersByIdsResponseDto => {
  return {
    subscriberId: subscriber.subscriberId,
    username: subscriber.username,
    naturalPersonId: subscriber.naturalPersonId,
    fullName: naturalPerson?.fullName || '',
    paternalSurname: naturalPerson?.paternalSurname || '',
    maternalSurname: naturalPerson?.maternalSurname || '',
    documentNumber: naturalPerson?.documentNumber || '',
  };
};
