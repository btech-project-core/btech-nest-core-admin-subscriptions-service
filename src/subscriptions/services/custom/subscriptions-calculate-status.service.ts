import { Injectable } from '@nestjs/common';
import { StatusSubscription } from '../../enums/status-subscription.enum';

@Injectable()
export class SubscriptionsCalculateStatusService {
  execute(initialDate: string): StatusSubscription {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(initialDate);
    startDate.setHours(0, 0, 0, 0);
    if (startDate <= today) return StatusSubscription.ACTIVE;
    return StatusSubscription.PENDING;
  }
}
