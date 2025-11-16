import { Injectable } from '@nestjs/common';
import { DocumentUsersService } from 'src/common/services/document-users.service';
import { UserValidationRresponseDto } from 'src/common/dto/user-validation.dto';

@Injectable()
export class SubscriptionsValidateUsersWithSubscriptionService {
  constructor(private readonly documentUsersService: DocumentUsersService) {}

  async execute(
    file: Express.Multer.File,
  ): Promise<UserValidationRresponseDto> {
    return await this.documentUsersService.validateUserDocument(file);
  }
}
