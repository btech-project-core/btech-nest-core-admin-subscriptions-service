import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscriber } from '../../entities';

@Injectable()
export class SubscribersDeleteAlternalService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
  ) {}

  async execute(): Promise<{ message: string }> {
    const fs = await import('fs/promises');
    const path = await import('path');

    const subscribersSince30Sep = await this.subscriberRepository
      .createQueryBuilder('subscriber')
      .select(['subscriber.username', 'subscriber.createdAt'])
      .where('subscriber.createdAt >= :startDate', {
        startDate: '2025-09-30 00:00:00',
      })
      .orderBy('subscriber.createdAt', 'ASC')
      .getMany();
    if (subscribersSince30Sep.length === 0)
      return {
        message: 'No se encontraron subscribers desde el 30 de septiembre',
      };
    const usernames = subscribersSince30Sep.map((sub) => sub.username);
    // Guardar el JSON
    const outputPath = path.join(
      process.cwd(),
      'src',
      'json-backups',
      'subscribers-since-sept-30.json',
    );
    await fs.writeFile(outputPath, JSON.stringify(usernames, null, 2));
    return {
      message: `Se encontraron ${subscribersSince30Sep.length} subscribers registrados desde el 30 de septiembre. Usernames guardados en: ${outputPath}`,
    };
  }
}
