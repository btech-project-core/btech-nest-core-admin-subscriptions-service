import { FindAllSubscriptionsBussineResponseDto } from '../dto/find-all-subscriptions-bussine.dto';
import { SubscriptionsBussine } from '../entities/subscriptions-bussine.entity';

export const formatSubscriptionsBussineResponse = (
  subscriptionBussine: SubscriptionsBussine,
): FindAllSubscriptionsBussineResponseDto => ({
  subscriptionBussineId: subscriptionBussine.subscriptionBussineId,
  initialDate: subscriptionBussine.subscription.initialDate,
  finalDate: subscriptionBussine.subscription.finalDate,
  personId: subscriptionBussine.personId,
  personData: subscriptionBussine.personData,
  status: subscriptionBussine.subscription.status,
});
