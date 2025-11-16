import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { CreateSubscriptionDto } from '../../dto/create-subscription.dto';
import { Subscription } from '../../entities/subscription.entity';
import { UserValidationRresponseDto } from 'src/common/dto/user-validation.dto';
import { SubscriptionsService } from 'src/subscriptions-services/entities/subscriptions-service.entity';
import { SubscriptionsCreateBussinesService } from './subscriptions-create-bussines.service';
import { SubscriptionsValidateUsersWithSubscriptionService } from './subscriptions-validate-users-with-subscription.service';

@Injectable()
export class SubscriptionsCustomService {
  constructor(
    private readonly subscriptionsCreateBussinesService: SubscriptionsCreateBussinesService,
    private readonly subscriptionsValidateUsersWithSubscriptionService: SubscriptionsValidateUsersWithSubscriptionService,
  ) {}

  async createSubscriptionsBussine(
    createSubscriptionDto: CreateSubscriptionDto,
    subscription: Subscription,
    subscriptionsServices: SubscriptionsService[],
    queryRunner?: QueryRunner,
  ) {
    return await this.subscriptionsCreateBussinesService.execute(
      createSubscriptionDto,
      subscription,
      subscriptionsServices,
      queryRunner,
    );
  }

  async validateUsersWithSubscription(
    file: Express.Multer.File,
  ): Promise<UserValidationRresponseDto> {
    return await this.subscriptionsValidateUsersWithSubscriptionService.execute(
      file,
    );
  }
}
