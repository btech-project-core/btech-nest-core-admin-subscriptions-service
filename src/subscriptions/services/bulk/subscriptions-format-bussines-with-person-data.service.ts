import { Injectable } from '@nestjs/common';
import { AdminPersonsService } from 'src/common/services/admin-persons.service';
import { formatSubscriptionBussineResponse } from '../../helpers/format-subscription-response.helper';
import { FindSubscriptionMultiplePersonDataResponseDto } from 'src/common/dto/find-subscription-multiple-person-data.dto';
import { SubscriptionsBussine } from 'src/subscriptions-bussines/entities/subscriptions-bussine.entity';
import { FindAllSubscriptionResponseDto } from '../../dto/find-all-subscription.dto';

@Injectable()
export class SubscriptionsFormatBussinesWithPersonDataService {
  constructor(private readonly adminPersonsService: AdminPersonsService) {}

  async execute(
    subscriptionsBussineList: SubscriptionsBussine[],
    term?: string,
  ): Promise<FindAllSubscriptionResponseDto[]> {
    const personIds = subscriptionsBussineList.map(
      (subscriptionBussine) => subscriptionBussine.personId,
    );

    let personsData: FindSubscriptionMultiplePersonDataResponseDto[] = [];
    if (personIds.length > 0) {
      personsData =
        await this.adminPersonsService.findMultipleSubscriptionPersonData({
          personIds,
        });
    }

    const personsMap = new Map(
      personsData.map((person) => [person.personId, person]),
    );

    const formattedData = subscriptionsBussineList
      .map((subscriptionBussine) => {
        const person = personsMap.get(subscriptionBussine.personId);
        return formatSubscriptionBussineResponse(
          subscriptionBussine,
          person,
          term,
        );
      })
      .filter((item) => item !== null);

    return formattedData;
  }
}
