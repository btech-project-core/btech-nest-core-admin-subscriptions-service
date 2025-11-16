import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { CreateSubscriptionDto } from '../../dto/create-subscription.dto';
import { SubscriptionsValidateNoOverlapService } from './subscriptions-validate-no-overlap.service';

@Injectable()
export class SubscriptionsValidateDuplicateOverlapService {
  constructor(
    private readonly subscriptionsValidateNoOverlapService: SubscriptionsValidateNoOverlapService,
  ) {}

  async execute(
    createSubscriptionDto: CreateSubscriptionDto,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const { personId, initialDate, finalDate } = createSubscriptionDto;
    await this.subscriptionsValidateNoOverlapService.execute(
      personId,
      initialDate,
      finalDate,
      queryRunner,
    );
  }
}
