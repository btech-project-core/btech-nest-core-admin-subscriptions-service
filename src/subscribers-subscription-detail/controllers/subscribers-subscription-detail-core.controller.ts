import { Controller } from '@nestjs/common';
import { SubscribersSubscriptionDetailCoreService } from '../services/core';

@Controller()
export class SubscribersSubscriptionDetailCoreController {
  constructor(
    private readonly subscribersSubscriptionDetailCoreService: SubscribersSubscriptionDetailCoreService,
  ) {}

  // Los métodos del controller se implementarán según los requerimientos específicos
}
