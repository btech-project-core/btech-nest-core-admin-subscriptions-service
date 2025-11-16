import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscriber } from '../../entities';

@Injectable()
export class SubscribersQueryGlobalByUsernameService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
  ) {}

  async execute(username: string): Promise<Subscriber | null> {
    const subscriber = await this.subscriberRepository
      .createQueryBuilder('subscriber')
      .where('subscriber.username = :username', { username })
      .andWhere('subscriber.subscriptionsBussineId IS NULL')
      .andWhere('subscriber.isActive = :isActive', { isActive: true })
      .getOne();
    return subscriber || null;
  }
}
