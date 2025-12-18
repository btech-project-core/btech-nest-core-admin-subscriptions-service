import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Subscriber } from '../../entities/subscriber.entity';
import {
  UpdateSubscriberDto,
  UpdateSubscriberResponseDto,
} from '../../dto/update-subscriber.dto';
import * as bcrypt from 'bcryptjs';
import { SubscribersFindOneService } from './subscribers-find-one.service';
import { formatFindOneSubscriberResponse } from 'src/subscribers/helpers/format-find-one-subscriber-response.helper';
import { SubscribersNotificationService } from '../notification/subscribers-notification.service';
import { AdminPersonsService } from 'src/common/services/admin-persons.service';

@Injectable()
export class SubscribersUpdateService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    private readonly subscribersFindOneService: SubscribersFindOneService,
    private readonly subscribersNotificationService: SubscribersNotificationService,
    private readonly adminPersonsService: AdminPersonsService,
  ) {}

  async execute(
    updateSubscriberDto: UpdateSubscriberDto,
  ): Promise<UpdateSubscriberResponseDto> {
    const {
      subscriberId,
      password,
      isConfirm,
      username,
      subscriptionDetailId,
      subscriptionBussineId,
      service,
      ipAddress,
      userAgent,
    } = updateSubscriberDto;

    // Validar que si se envía password, debe enviarse isConfirm
    if (password !== undefined && isConfirm === undefined)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message:
          'El campo isConfirm es requerido cuando se envía una nueva contraseña.',
      });

    // Verificar que el subscriber existe
    const subscriber =
      await this.subscribersFindOneService.execute(subscriberId);

    // Variable para determinar qué password enviar en el correo
    let passwordForEmail = 'No se actualizó';
    let passwordWasUpdated = false;
    let usernameWasUpdated = false;

    if (username !== undefined && username !== subscriber.username) {
      subscriber.username = username;
      usernameWasUpdated = true;
    }
    if (password !== undefined) {
      // Comparar si la contraseña enviada es la misma que la actual
      const isSamePassword = await bcrypt.compare(
        password,
        subscriber.password,
      );

      if (!isSamePassword) {
        // Solo actualizar si es diferente
        const hashedPassword = await bcrypt.hash(password, 10);
        subscriber.password = hashedPassword;
        passwordForEmail = password;
        passwordWasUpdated = true;
      }
    }
    if (isConfirm !== undefined) subscriber.isConfirm = isConfirm;

    // Actualizar el subscriber
    const updateResult = await this.subscriberRepository.save(subscriber);

    // Enviar correo de actualización solo si hubo cambios reales y service está presente
    if (
      (passwordWasUpdated || usernameWasUpdated) &&
      service &&
      subscriptionBussineId
    ) {
      const naturalPersonData =
        await this.adminPersonsService.findOneNaturalPerson({
          naturalPersonId: subscriber.naturalPersonId,
          subscriptionBussineId,
        });

      // Enviar correo de actualización (sin await para no bloquear la respuesta)
      this.subscribersNotificationService.sendUpdateEmail(
        updateResult,
        naturalPersonData,
        passwordForEmail,
        service,
        subscriptionDetailId,
        { ipAddress, userAgent },
      );
    }

    return formatFindOneSubscriberResponse(updateResult);
  }
}
