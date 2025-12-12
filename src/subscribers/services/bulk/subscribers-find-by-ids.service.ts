import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscriber } from '../../entities';
import {
  FindSubscribersByIdsDto,
  FindSubscribersByIdsResponseDto,
} from '../../dto/find-subscribers-by-ids.dto';
import { PaginationResponseDto } from 'src/common/dto';
import { FindMultipleNaturalPersonsWithFiltersResponseDto } from 'src/common/dto/find-multiple-natural-persons-with-filters.dto';
import { AdminPersonsService } from 'src/common/services';
import { formatFindSubscribersByIdsResponse } from 'src/subscribers/helpers/format-find-subscribers-by-ids-response.helper';

@Injectable()
export class SubscribersFindByIdsService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    private readonly adminPersonsService: AdminPersonsService,
  ) {}

  async execute(
    findSubscribersByIdsDto: FindSubscribersByIdsDto,
  ): Promise<
    | PaginationResponseDto<FindSubscribersByIdsResponseDto>
    | FindSubscribersByIdsResponseDto[]
  > {
    const { subscriberIds, term, hasPagination, page, limit } =
      findSubscribersByIdsDto;
    // 1. Buscar subscribers por IDs
    const subscribers = await this.subscriberRepository.find({
      where: subscriberIds.map((id) => ({ subscriberId: id })),
      select: ['subscriberId', 'username', 'naturalPersonId'],
    });
    // Si no hay subscribers, retornar según tipo de respuesta
    if (subscribers.length === 0) {
      if (hasPagination)
        return {
          data: [],
          total: 0,
          page: page || 1,
          limit: limit || 10,
          totalPages: 0,
        };
      return [];
    }
    // 2. Extraer naturalPersonIds únicos
    const naturalPersonIds = [
      ...new Set(subscribers.map((sub) => sub.naturalPersonId)),
    ];
    // 3. Llamar a admin-persons via NATS con filtros
    const naturalPersonsResult =
      await this.adminPersonsService.findMultipleNaturalPersonsByIdsWithFilters(
        {
          naturalPersonIds,
          term,
          hasPagination,
          page,
          limit,
        },
      );
    // 4. Verificar si es respuesta paginada o array simple
    const isPaginated = hasPagination && 'data' in naturalPersonsResult;
    if (isPaginated) {
      // Crear mapa de naturalPersonId -> data
      const naturalPersonsMap = new Map(
        naturalPersonsResult.data.map((np) => [np.naturalPersonId, np]),
      );
      // Combinar subscribers con naturalPersons (solo los que matchean)
      const combinedData = subscribers
        .filter((sub) => naturalPersonsMap.has(sub.naturalPersonId))
        .map((subscriber) =>
          formatFindSubscribersByIdsResponse(
            subscriber,
            naturalPersonsMap.get(subscriber.naturalPersonId),
          ),
        );
      return {
        data: combinedData,
        total: naturalPersonsResult.total,
        page: naturalPersonsResult.page,
        limit: naturalPersonsResult.limit,
        totalPages: naturalPersonsResult.totalPages,
      };
    }
    // Sin paginación - array simple
    const naturalPersonsArray =
      naturalPersonsResult as FindMultipleNaturalPersonsWithFiltersResponseDto[];
    const naturalPersonsMap = new Map(
      naturalPersonsArray.map((np) => [np.naturalPersonId, np]),
    );
    return subscribers
      .filter((sub) => naturalPersonsMap.has(sub.naturalPersonId))
      .map((subscriber) =>
        formatFindSubscribersByIdsResponse(
          subscriber,
          naturalPersonsMap.get(subscriber.naturalPersonId),
        ),
      );
  }
}
