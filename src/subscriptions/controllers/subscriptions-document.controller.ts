import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserValidationRresponseDto } from 'src/common/dto/user-validation.dto';
import { createMulterFile } from 'src/common/helpers/create-multer-file.helper';
import { FileDto } from 'src/common/dto/file.dto';
import { SubscriptionsValidateUserDocumentService } from '../services/document/subscriptions-validate-user-document.service';

@Controller()
export class SubscriptionsDocumentController {
  constructor(
    private readonly subscriptionsValidateUserDocumentService: SubscriptionsValidateUserDocumentService,
  ) {}

  @MessagePattern('subscriptions.validateUsersWithSubscription')
  validateUsersWithSubscription(
    @Payload() file: FileDto,
  ): Promise<UserValidationRresponseDto> {
    const fileData = createMulterFile(file);
    return this.subscriptionsValidateUserDocumentService.validateUserDocument(
      fileData,
    );
  }
}
