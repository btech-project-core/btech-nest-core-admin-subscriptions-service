import { Subscriber } from '../entities';
import { FindSubscribersByIdsResponseDto } from '../dto/find-subscribers-by-ids.dto';
import { FindMultipleNaturalPersonsWithFiltersResponseDto } from 'src/common/dto/find-multiple-natural-persons-with-filters.dto';

export const formatFindSubscribersByIdsResponse = (
  subscriber: Subscriber,
  naturalPerson: FindMultipleNaturalPersonsWithFiltersResponseDto | undefined,
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
