import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserValidationRresponseDto } from 'src/common/dto/user-validation.dto';
import { createMulterFile } from 'src/common/helpers/create-multer-file.helper';
import { FileDto } from 'src/common/dto/file.dto';
import { SubscriptionsCustomService } from '../services/custom';

@Controller()
export class SubscriptionsCustomController {
  constructor(private readonly subscriptionsCustomService: SubscriptionsCustomService) {}

  @MessagePattern('subscriptions.validateUsersWithSubscription')
  validateUsersWithSubscription(
    @Payload() file: FileDto,
  ): Promise<UserValidationRresponseDto> {
    const fileData = createMulterFile(file);
    return this.subscriptionsCustomService.validateUsersWithSubscription(fileData);
  }
}
