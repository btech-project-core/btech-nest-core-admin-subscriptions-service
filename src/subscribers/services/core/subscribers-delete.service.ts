import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Subscriber } from '../../entities';

@Injectable()
export class SubscribersDeleteService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
  ) {}

  async execute(subscriberId: string): Promise<{ message: string }> {
    const subscriber = await this.subscriberRepository.findOne({
      where: { subscriberId },
    });
    if (!subscriber)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `El suscriptor con id ${subscriberId} no se encuentra registrado.`,
      });
    await this.subscriberRepository.remove(subscriber);
    return {
      message: 'Suscriptor eliminado correctamente',
    };
  }
}
