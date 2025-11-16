import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Subscriber } from '../../entities';

@Injectable()
export class SubscribersValidateExistsService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
  ) {}

  async execute(subscriberId: string): Promise<Subscriber> {
    const subscriber = await this.subscriberRepository.findOne({
      where: { subscriberId: subscriberId.trim() },
    });
    if (!subscriber)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Suscriptor con ID '${subscriberId}' no encontrado`,
      });
    return subscriber;
  }
}
