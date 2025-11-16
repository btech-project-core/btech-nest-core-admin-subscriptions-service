import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionsService } from '../../entities/subscriptions-service.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class SubscriptionsServicesFindOneService {
  constructor(
    @InjectRepository(SubscriptionsService)
    private readonly subscriptionsServicesRepository: Repository<SubscriptionsService>,
  ) {}

  async execute(subscriptionsServiceId: string): Promise<SubscriptionsService> {
    const subscriptionsService =
      await this.subscriptionsServicesRepository.findOne({
        where: { subscriptionsServiceId: subscriptionsServiceId.trim() },
      });
    if (!subscriptionsService)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Servicio de suscripción con ID '${subscriptionsServiceId}' no encontrado`,
      });
    return subscriptionsService;
  }
}
