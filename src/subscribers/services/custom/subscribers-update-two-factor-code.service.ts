import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscriber } from '../../entities/subscriber.entity';
import { SubscribersFindOneService } from '../core';
import {
  UpdateSubscriberTwoFactorCodeDto,
  UpdateSubscriberTwoFactorCodeResponseDto,
} from 'src/subscribers/dto/update-subscriber-two-factor-code.dto';
import { SubscribersFindOneByIdWithLoginService } from './subscribers-find-one-by-id-with-login.service';

@Injectable()
export class SubscribersUpdateTwoFactorCodeService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    private readonly subscribersFindOneService: SubscribersFindOneService,
    private readonly subscribersFindOneByIdWithLoginService: SubscribersFindOneByIdWithLoginService,
  ) {}

  async execute(
    updateSubscriberDto: UpdateSubscriberTwoFactorCodeDto,
  ): Promise<UpdateSubscriberTwoFactorCodeResponseDto | null> {
    const { subscriberId, isTwoFactorEnabled, twoFactorSecret } =
      updateSubscriberDto;
    // Verificar que el subscriber existe
    const subscriber =
      await this.subscribersFindOneService.execute(subscriberId);
    subscriber.twoFactorSecret = twoFactorSecret ?? subscriber.twoFactorSecret;
    subscriber.isTwoFactorEnabled =
      isTwoFactorEnabled ?? subscriber.isTwoFactorEnabled;
    // Actualizar el subscriber
    await this.subscriberRepository.save(subscriber);
    return await this.subscribersFindOneByIdWithLoginService.execute(
      subscriberId,
    );
  }
}
