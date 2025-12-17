import { Observable } from 'rxjs';
import { SendUserRegistrationEmailDto } from '../dto/send-user-registration-email.dto';
import { SendEmailResponseDto } from '../dto/send-email-response.dto';

export interface EmailsService {
  sendUserRegistrationEmail(
    request: SendUserRegistrationEmailDto,
  ): Observable<SendEmailResponseDto>;
}
