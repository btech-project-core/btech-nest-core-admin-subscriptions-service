import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Subscriber } from '../../entities/subscriber.entity';
import { UserProfileResponseDto } from 'src/common/dto/user-profile.dto';
import { SubscribersFindOneByIdWithLoginService } from '../custom/subscribers-find-one-by-id-with-login.service';

@Injectable()
export class SubscribersUpdateService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    private readonly subscribersFindOneByIdWithLoginService: SubscribersFindOneByIdWithLoginService,
  ) {}

  async execute(
    subscriberId: string,
    updateData: Partial<Subscriber>,
  ): Promise<UserProfileResponseDto> {
    const updateResult = await this.subscriberRepository.update(
      subscriberId,
      updateData,
    );
    if (updateResult.affected === 0)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `El usuario con id ${subscriberId} no se encuentra registrado.`,
      });

    const updatedSubscriber =
      await this.subscribersFindOneByIdWithLoginService.execute(subscriberId);
    if (!updatedSubscriber)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `El usuario con id ${subscriberId} no se encuentra registrado.`,
      });
    return updatedSubscriber;
  }
}
