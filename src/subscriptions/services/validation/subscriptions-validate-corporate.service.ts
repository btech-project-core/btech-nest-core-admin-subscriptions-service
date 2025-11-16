import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CreateSubscriptionDto } from '../../dto/create-subscription.dto';
import { ModalitySubscription } from '../../enums/modality-subscription.enum';

@Injectable()
export class SubscriptionsValidateCorporateService {
  execute(createSubscriptionDto: CreateSubscriptionDto): void {
    const { modality, subscriptionsBusiness } = createSubscriptionDto;
    if (modality === ModalitySubscription.CORPORATE) {
      if (!subscriptionsBusiness || subscriptionsBusiness.length === 0)
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message:
            'Para modalidad corporativa se requiere al menos un subscription business',
        });
      subscriptionsBusiness.forEach((business) => {
        if (!business.personId)
          throw new RpcException({
            status: HttpStatus.BAD_REQUEST,
            message:
              'Para modalidad corporativa, cada subscription business debe tener un personId',
          });
      });
    } else {
      if (subscriptionsBusiness.length !== 1)
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message:
            'Para modalidad no corporativa se requiere exactamente un subscription business',
        });
    }
  }
}
