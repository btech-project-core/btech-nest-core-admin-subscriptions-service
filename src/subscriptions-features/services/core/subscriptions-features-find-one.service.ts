import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { SubscriptionFeatures } from '../../entities/subscription-features.entity';

@Injectable()
export class SubscriptionsFeaturesFindOneService {
  constructor(
    @InjectRepository(SubscriptionFeatures)
    private readonly subscriptionFeaturesRepository: Repository<SubscriptionFeatures>,
  ) {}

  async execute(
    subscriptionFeaturesId: string,
    subscriptionDetailId: string,
  ): Promise<SubscriptionFeatures> {
    const subscriptionFeatures =
      await this.subscriptionFeaturesRepository.findOne({
        where: {
          subscriptionFeaturesId: subscriptionFeaturesId.trim(),
          subscriptionDetailId: subscriptionDetailId.trim(),
        },
      });
    if (!subscriptionFeatures)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Característica de suscripción con ID '${subscriptionFeaturesId}' no encontrada`,
      });
    return subscriptionFeatures;
  }
}
