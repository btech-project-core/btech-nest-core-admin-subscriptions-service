import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionsBussine } from '../../entities/subscriptions-bussine.entity';

@Injectable()
export class SubscriptionsBussinesGetClientPersonIdsService {
  constructor(
    @InjectRepository(SubscriptionsBussine)
    private readonly subscriptionsBussinesRepository: Repository<SubscriptionsBussine>,
  ) {}

  async execute(): Promise<string[]> {
    const result = await this.subscriptionsBussinesRepository
      .createQueryBuilder('subscriptionBussine')
      .select('subscriptionBussine.personId')
      .getMany();
    return result.map((row) => row.personId);
  }
}
