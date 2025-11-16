import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from '../../dto/create-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../../entities/subscription.entity';
import { FindAllSubscriptionResponseDto } from '../../dto/find-all-subscription.dto';
import { TransactionService } from 'src/common/services/transaction.service';
import { SubscriptionsValidationService } from '../validation/subscriptions-validation.service';
import { SubscriptionsCustomService } from '../custom/subscriptions-custom.service';
import { SubscriptionsBulkService } from '../bulk/subscriptions-bulk.service';
import { validateSubscriptionDates } from '../../helpers/validate-subscription-dates.helper';
import { SubscriptionsCalculateStatusService } from '../custom/subscriptions-calculate-status.service';

@Injectable()
export class SubscriptionsCreateService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
    private readonly transactionService: TransactionService,
    private readonly subscriptionsValidationService: SubscriptionsValidationService,
    private readonly subscriptionsCustomService: SubscriptionsCustomService,
    private readonly subscriptionsBulkService: SubscriptionsBulkService,
    private readonly subscriptionsCalculateStatusService: SubscriptionsCalculateStatusService,
  ) {}

  async execute(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<FindAllSubscriptionResponseDto[]> {
    this.subscriptionsValidationService.validateCorporateSubscription(
      createSubscriptionDto,
    );
    const subscription = await this.transactionService.runInTransaction(
      async (qr) => {
        const validatedEntities =
          await this.subscriptionsValidationService.validateAllRequiredEntities(
            createSubscriptionDto,
          );
        await this.subscriptionsValidationService.validateDuplicateAndOverlap(
          createSubscriptionDto,
          qr,
        );

        // Crear subscription
        const { initialDate, finalDate, contractSigningDate } =
          createSubscriptionDto;
        validateSubscriptionDates(initialDate, finalDate, contractSigningDate);
        const calculatedStatus =
          this.subscriptionsCalculateStatusService.execute(initialDate);
        const repository = qr.manager.getRepository(Subscription);
        const subscription = repository.create({
          ...createSubscriptionDto,
          status: calculatedStatus,
        });
        await repository.save(subscription);

        await this.subscriptionsCustomService.createSubscriptionsBussine(
          createSubscriptionDto,
          subscription,
          validatedEntities.subscriptionsServices,
          qr,
        );
        return subscription;
      },
    );
    return this.subscriptionsBulkService.findOneWithCreateResponse(
      subscription.subscriptionId,
    );
  }
}
