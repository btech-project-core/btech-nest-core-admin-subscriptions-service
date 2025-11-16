import { Injectable } from '@nestjs/common';
import { SubscriptionDetailDesigneMode } from '../../entities/subscription-detail-designe-mode.entity';
import { CreateSubscriptionDetailDesigneModeDto } from '../../dto/create-subscription-detail-designe-mode.dto';
import { SubscriptionDetailDesigneModeCreateService } from './subscription-detail-designe-mode-create.service';
import { SubscriptionDetailDesigneModeFindAllService } from './subscription-detail-designe-mode-find-all.service';
import { SubscriptionDetailDesigneModeFindOneService } from './subscription-detail-designe-mode-find-one.service';
import { SubscriptionDetailDesigneModeDeleteService } from './subscription-detail-designe-mode-delete.service';

@Injectable()
export class SubscriptionDetailDesigneModeCoreService {
  constructor(
    private readonly subscriptionDetailDesigneModeCreateService: SubscriptionDetailDesigneModeCreateService,
    private readonly subscriptionDetailDesigneModeFindAllService: SubscriptionDetailDesigneModeFindAllService,
    private readonly subscriptionDetailDesigneModeFindOneService: SubscriptionDetailDesigneModeFindOneService,
    private readonly subscriptionDetailDesigneModeDeleteService: SubscriptionDetailDesigneModeDeleteService,
  ) {}

  async create(
    createDto: CreateSubscriptionDetailDesigneModeDto,
  ): Promise<SubscriptionDetailDesigneMode> {
    return await this.subscriptionDetailDesigneModeCreateService.execute(
      createDto,
    );
  }

  async findAll(): Promise<SubscriptionDetailDesigneMode[]> {
    return await this.subscriptionDetailDesigneModeFindAllService.execute();
  }

  async findOne(
    subscriptionDetailDesigneModeId: string,
  ): Promise<SubscriptionDetailDesigneMode> {
    return await this.subscriptionDetailDesigneModeFindOneService.execute(
      subscriptionDetailDesigneModeId,
    );
  }

  async delete(
    subscriptionDetailDesigneModeId: string,
  ): Promise<{ message: string }> {
    return await this.subscriptionDetailDesigneModeDeleteService.execute(
      subscriptionDetailDesigneModeId,
    );
  }
}
