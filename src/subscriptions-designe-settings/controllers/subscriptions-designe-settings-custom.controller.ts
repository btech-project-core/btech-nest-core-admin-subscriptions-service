import { Controller } from '@nestjs/common';
import { SubscriptionsDesigneSettingsCustomService } from '../services/custom';

@Controller()
export class SubscriptionsDesigneSettingsCustomController {
  constructor(
    private readonly subscriptionsDesigneSettingsCustomService: SubscriptionsDesigneSettingsCustomService,
  ) {}

  // Los métodos del controller se implementarán según los requerimientos específicos
}
