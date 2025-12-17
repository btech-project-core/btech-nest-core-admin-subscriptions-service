import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { EMAIL_SERVICE } from 'src/config';
import { firstValueFrom } from 'rxjs';
import { EmailsService } from '../interfaces/email.interface';
import { SendUserRegistrationEmailDto } from '../dto/send-user-registration-email.dto';
import { SendEmailResponseDto } from '../dto/send-email-response.dto';

@Injectable()
export class EmailsClient implements OnModuleInit {
  private emailsService: EmailsService;

  constructor(
    @Inject(EMAIL_SERVICE)
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.emailsService = this.client.getService<EmailsService>('EmailsService');
  }

  async sendUserRegistrationEmail(
    request: SendUserRegistrationEmailDto,
  ): Promise<SendEmailResponseDto> {
    return firstValueFrom(
      this.emailsService.sendUserRegistrationEmail(request),
    );
  }
}
