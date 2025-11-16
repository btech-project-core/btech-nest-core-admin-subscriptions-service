import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CreateSubscriptionsBussineDto } from 'src/subscriptions-bussines/dto/create-subscriptions-bussine.dto';

@Injectable()
export class SubscriptionsValidateUniqueServicesService {
  execute(subscriptionsBusiness: CreateSubscriptionsBussineDto[]): void {
    const allServiceIds: string[] = [];
    subscriptionsBusiness.forEach((business) => {
      business.subscriptionDetails.forEach((detail) => {
        allServiceIds.push(detail.subscriptionServiceId);
      });
    });

    const duplicateIds = allServiceIds.filter(
      (id, index) => allServiceIds.indexOf(id) !== index,
    );

    if (duplicateIds.length > 0)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Servicios de suscripción duplicados encontrados: ${[...new Set(duplicateIds)].join(', ')}`,
      });
  }
}
