import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscriber } from '../../entities';
import {
  FindSubscribersByIdsDto,
  FindSubscribersByIdsResponseDto,
} from '../../dto/find-subscribers-by-ids.dto';
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
  ): Promise<FindSubscribersByIdsResponseDto[]> {
    const { subscriberIds } = findSubscribersByIdsDto;
    // 1. Buscar subscribers por IDs
    const subscribers = await this.subscriberRepository.find({
      where: subscriberIds.map((id) => ({ subscriberId: id })),
      select: ['subscriberId', 'username', 'naturalPersonId'],
    });
    // Si no hay subscribers, retornar array vacío
    if (subscribers.length === 0) return [];
    // 2. Extraer naturalPersonIds únicos
    const naturalPersonIds = [
      ...new Set(subscribers.map((sub) => sub.naturalPersonId)),
    ];
    // 3. Llamar a admin-persons via NATS para obtener los datos de las personas naturales
    const naturalPersonsData =
      await this.adminPersonsService.findMultipleNaturalPersonsByIds({
        naturalPersonIds,
      });
    // 4. Crear un mapa de naturalPersonId -> data para facilitar el acceso
    const naturalPersonsMap = new Map(
      naturalPersonsData.map((np) => [np.naturalPersonId, np]),
    );
    // 5. Combinar la información y formatear la respuesta
    return subscribers.map((subscriber) =>
      formatFindSubscribersByIdsResponse(
        subscriber,
        naturalPersonsMap.get(subscriber.naturalPersonId),
      ),
    );
  }
}
