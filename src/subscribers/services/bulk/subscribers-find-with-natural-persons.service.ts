import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Subscriber } from '../../entities';
import {
  FindSubscribersWithNaturalPersonsDto,
  SubscriberWithNaturalPersonDto,
} from '../../dto';
import { PaginationResponseDto } from 'src/common/dto';
import { StatusSubscription } from 'src/subscriptions/enums';
import { AdminPersonsService } from 'src/common/services';

@Injectable()
export class SubscribersFindWithNaturalPersonsService {
  // Cache para el count de subscribers por subscriptionDetailId
  private countCache = new Map<string, { count: number; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    private readonly adminPersonsService: AdminPersonsService,
  ) {}

  async execute(
    findDto: FindSubscribersWithNaturalPersonsDto,
  ): Promise<PaginationResponseDto<SubscriberWithNaturalPersonDto>> {
    const { subscriptionDetailId, term, subscriberIds, ...paginationDto } =
      findDto;
    const { page = 1, limit = 8 } = paginationDto;
    const skip = (page - 1) * limit;

    // Crear query base
    const queryBuilder = this.subscriberRepository
      .createQueryBuilder('subscriber')
      .innerJoin('subscriber.subscriptionsBussine', 'subscriptionsBussine')
      .innerJoin('subscriptionsBussine.subscription', 'subscription')
      .innerJoin(
        'subscriber.subscribersSubscriptionDetails',
        'subscribersSubscriptionDetails',
      )
      .innerJoin(
        'subscribersSubscriptionDetails.subscriptionDetail',
        'subscriptionDetail',
      )
      .where(
        'subscriptionDetail.subscriptionDetailId = :subscriptionDetailId',
        {
          subscriptionDetailId,
        },
      )
      .andWhere('subscription.status = :status', {
        status: StatusSubscription.ACTIVE,
      })
      .andWhere('subscribersSubscriptionDetails.isActive = :isActive', {
        isActive: true,
      })
      .andWhere('subscriber.subscriberId IN (:...subscriberIds)', {
        subscriberIds,
      });

    queryBuilder
      .select([
        'subscriber.subscriberId',
        'subscriber.username',
        'subscriber.naturalPersonId',
        'subscriber.createdAt',
      ])
      .orderBy('subscriber.createdAt', 'DESC');

    const data = await queryBuilder.skip(skip).take(limit).getMany();

    if (data.length === 0)
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };

    // Obtener el count con cache
    const total = await this.getCachedCount(subscriptionDetailId, queryBuilder);
    // Pasar el term al servicio de natural persons
    const naturalPersonsData =
      await this.adminPersonsService.findMultipleNaturalPersonsByIds({
        naturalPersonIds: data.map((s) => s.naturalPersonId),
        term,
      });
    const naturalPersonsMap = new Map(
      naturalPersonsData.map((np) => [np.naturalPersonId, np]),
    );
    const subscribersWithNaturalPersons = data.map((subscriber) => ({
      subscriberId: subscriber.subscriberId,
      username: subscriber.username,
      naturalPerson: naturalPersonsMap.get(subscriber.naturalPersonId)!,
    }));
    return {
      data: subscribersWithNaturalPersons,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Obtiene el count con cache para evitar queries lentos en cada paginación
   */
  private async getCachedCount(
    subscriptionDetailId: string,
    queryBuilder: SelectQueryBuilder<Subscriber>,
  ): Promise<number> {
    const cacheKey = `count_${subscriptionDetailId}`;
    const cached = this.countCache.get(cacheKey);
    const now = Date.now();

    // Si existe en cache y no ha expirado, retornar
    if (cached && now - cached.timestamp < this.CACHE_TTL) return cached.count;
    // Ejecutar count y guardar en cache
    const count = await queryBuilder.getCount();
    this.countCache.set(cacheKey, { count, timestamp: now });
    return count;
  }

  invalidateCountCache(subscriptionDetailId: string): void {
    const cacheKey = `count_${subscriptionDetailId}`;
    this.countCache.delete(cacheKey);
  }
}
