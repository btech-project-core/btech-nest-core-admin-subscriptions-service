import { Injectable } from '@nestjs/common';
import { SubscribersSendRegistrationEmailService } from './subscribers-send-registration-email.service';
import { SubscribersSendUpdateEmailService } from './subscribers-send-update-email.service';
import { FindOneNaturalPersonResponseDto } from 'src/common/dto/find-one-natural-person.dto';
import { Subscriber } from 'src/subscribers/entities';

@Injectable()
export class SubscribersNotificationService {
  constructor(
    private readonly subscribersSendRegistrationEmailService: SubscribersSendRegistrationEmailService,
    private readonly subscribersSendUpdateEmailService: SubscribersSendUpdateEmailService,
  ) {}
  async sendRegistrationEmail(
    subscriber: Subscriber,
    naturalPersonData: FindOneNaturalPersonResponseDto,
    password: string,
    roleCode: string,
    codeService: string,
    domain: string,
    subscriptionDetailId: string,
    requestMetadata?: { ipAddress?: string; userAgent?: string },
  ): Promise<void> {
    await this.subscribersSendRegistrationEmailService.execute(
      subscriber,
      naturalPersonData,
      password,
      roleCode,
      codeService,
      domain,
      subscriptionDetailId,
      requestMetadata,
    );
  }

  async sendUpdateEmail(
    subscriber: Subscriber,
    naturalPersonData: FindOneNaturalPersonResponseDto,
    password: string,
    codeService: string,
    subscriptionDetailId: string,
    requestMetadata?: { ipAddress?: string; userAgent?: string },
  ): Promise<void> {
    await this.subscribersSendUpdateEmailService.execute(
      subscriber,
      naturalPersonData,
      password,
      codeService,
      subscriptionDetailId,
      requestMetadata,
    );
  }
}
