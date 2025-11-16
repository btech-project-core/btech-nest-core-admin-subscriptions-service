import { Injectable } from '@nestjs/common';
import { Subscriber } from '../../entities';
import { SubscriberAlertLevelValidation } from '../../interfaces';
import { SubscribersValidateExistsService } from './subscribers-validate-exists.service';
import { SubscribersCheckActiveByNaturalPersonService } from './subscribers-check-active-by-natural-person.service';
import { SubscribersIsValidByNaturalPersonIdService } from './subscribers-is-valid-by-natural-person-id.service';
import { SubscribersValidateAlertLevelService } from './subscribers-validate-alert-level.service';

@Injectable()
export class SubscribersValidationService {
  constructor(
    private readonly subscribersValidateExistsService: SubscribersValidateExistsService,
    private readonly subscribersCheckActiveByNaturalPersonService: SubscribersCheckActiveByNaturalPersonService,
    private readonly subscribersIsValidByNaturalPersonIdService: SubscribersIsValidByNaturalPersonIdService,
    private readonly subscribersValidateAlertLevelService: SubscribersValidateAlertLevelService,
  ) {}

  async validateExists(subscriberId: string): Promise<Subscriber> {
    return this.subscribersValidateExistsService.execute(subscriberId);
  }

  async checkActiveSubscriptionsByNaturalPersonId(
    naturalPersonId: string,
  ): Promise<boolean> {
    return this.subscribersCheckActiveByNaturalPersonService.execute(
      naturalPersonId,
    );
  }

  async isValidByNaturalPersonId(
    naturalPersonIds: string[],
    service: string,
  ): Promise<string> {
    return this.subscribersIsValidByNaturalPersonIdService.execute(
      naturalPersonIds,
      service,
    );
  }

  async validateSubscriberAlertLevel(
    subscriberIds: string[],
    levelAlertCode: string,
  ): Promise<SubscriberAlertLevelValidation[]> {
    return this.subscribersValidateAlertLevelService.execute(
      subscriberIds,
      levelAlertCode,
    );
  }
}
