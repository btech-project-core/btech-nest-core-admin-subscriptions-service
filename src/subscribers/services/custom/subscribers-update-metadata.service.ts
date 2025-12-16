import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscriber } from '../../entities/subscriber.entity';
import { UpdateSubscriberMetadataDto } from '../../dto/update-subscriber-metadata.dto';

@Injectable()
export class SubscribersUpdateMetadataService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
  ) {}

  async execute(updateData: UpdateSubscriberMetadataDto): Promise<void> {
    const { naturalPersonId, naturalPerson } = updateData;

    // Actualizar el campo metadata para todos los subscribers
    // que coincidan con el naturalPersonId.
    // Usamos QueryBuilder para una actualización más eficiente en la BD.
    await this.subscriberRepository
      .createQueryBuilder()
      .update(Subscriber)
      .set({ metadata: naturalPerson })
      .where('naturalPersonId = :naturalPersonId', { naturalPersonId })
      .execute();
  }
}
