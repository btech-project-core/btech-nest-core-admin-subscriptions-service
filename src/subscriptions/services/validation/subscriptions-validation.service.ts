import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { CreateSubscriptionDto } from '../../dto/create-subscription.dto';
import { SubscriptionsCheckActiveByPersonService } from './subscriptions-check-active-by-person.service';
import { SubscriptionsValidateCorporateService } from './subscriptions-validate-corporate.service';
import { SubscriptionsValidateAllEntitiesService } from './subscriptions-validate-all-entities.service';
import { SubscriptionsValidateDuplicateOverlapService } from './subscriptions-validate-duplicate-overlap.service';

@Injectable()
export class SubscriptionsValidationService {
  constructor(
    private readonly subscriptionsCheckActiveByPersonService: SubscriptionsCheckActiveByPersonService,
    private readonly subscriptionsValidateCorporateService: SubscriptionsValidateCorporateService,
    private readonly subscriptionsValidateAllEntitiesService: SubscriptionsValidateAllEntitiesService,
    private readonly subscriptionsValidateDuplicateOverlapService: SubscriptionsValidateDuplicateOverlapService,
  ) {}

  async checkActiveSubscriptionsByPersonId(personId: string): Promise<boolean> {
    return await this.subscriptionsCheckActiveByPersonService.execute(personId);
  }

  validateCorporateSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
  ): void {
    this.subscriptionsValidateCorporateService.execute(createSubscriptionDto);
  }

  async validateAllRequiredEntities(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<{ subscriptionsServices: any[] }> {
    return await this.subscriptionsValidateAllEntitiesService.execute(
      createSubscriptionDto,
    );
  }

  async validateDuplicateAndOverlap(
    createSubscriptionDto: CreateSubscriptionDto,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    await this.subscriptionsValidateDuplicateOverlapService.execute(
      createSubscriptionDto,
      queryRunner,
    );
  }
}
