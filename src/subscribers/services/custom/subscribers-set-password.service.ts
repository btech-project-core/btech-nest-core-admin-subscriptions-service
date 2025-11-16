import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Subscriber } from '../../entities';

@Injectable()
export class SubscribersSetPasswordService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
  ) {}

  async execute(
    subscriberId: string,
    hashedPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    const subscriber = await this.subscriberRepository.findOne({
      where: { subscriberId },
    });
    if (!subscriber)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `El subscriber con ID ${subscriberId} no existe`,
      });
    subscriber.password = hashedPassword;
    if (!subscriber.isConfirm) subscriber.isConfirm = true;
    await this.subscriberRepository.save(subscriber);
    return {
      success: true,
      message: 'Contraseña actualizada correctamente',
    };
  }
}
