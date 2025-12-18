import { Injectable, Logger } from '@nestjs/common';
import { EmailsClient } from 'src/communications/grpc/clients/emails.client';
import { SendUserUpdateEmailDto } from 'src/communications/grpc/dto/send-user-update-email.dto';
import { Subscriber } from 'src/subscribers/entities/subscriber.entity';
import { FindOneNaturalPersonResponseDto } from 'src/common/dto/find-one-natural-person.dto';
import { SubscribersFindOneByIdWithLoginService } from '../custom/subscribers-find-one-by-id-with-login.service';
import { CodeService } from 'src/common/enums';
import { SubscriptionDetailDesigneModeCustomService } from 'src/subscription-detail-designe-mode/services/custom';
import { GrpcMetadataDto } from 'src/communications/grpc/dto/send-user-registration-email.dto';

@Injectable()
export class SubscribersSendUpdateEmailService {
  private readonly logger = new Logger(SubscribersSendUpdateEmailService.name);

  constructor(
    private readonly emailsClient: EmailsClient,
    private readonly subscriptionDetailDesigneModeCustomService: SubscriptionDetailDesigneModeCustomService,
    private readonly subscribersFindOneByIdWithLoginService: SubscribersFindOneByIdWithLoginService,
  ) {}

  async execute(
    subscriber: Subscriber,
    naturalPersonData: FindOneNaturalPersonResponseDto,
    password: string,
    codeService: string,
    subscriptionDetailId: string,
    requestMetadata?: { ipAddress?: string; userAgent?: string },
  ): Promise<void> {
    try {
      // Obtener el primer email disponible de la persona natural
      const email = naturalPersonData.person?.personInformation?.find(
        (info) => info.informationType.description === 'Correo',
      )?.description;
      if (!email) {
        this.logger.warn(
          `No se encontró email para el subscriber ${subscriber.subscriberId}, correo de actualización no enviado`,
        );
        return;
      }
      // Ejecutar llamadas en paralelo
      const [designeSettings, userProfile] = await Promise.all([
        this.subscriptionDetailDesigneModeCustomService.findByDomain(
          subscriptionDetailId,
          'CLA',
        ),
        this.subscribersFindOneByIdWithLoginService.execute(
          subscriber.subscriberId,
          codeService as CodeService,
        ),
      ]);
      // Obtener el logo principal (brandOne) o usar un valor por defecto
      const logoUrl =
        designeSettings.configurations?.[0]?.brandOne || 'default-logo-url';
      // Obtener el color primario o usar un valor por defecto
      const primaryColor =
        designeSettings.configurations?.[0]?.primaryColor || '#000000';
      // Construir el nombre completo
      const fullName =
        `${naturalPersonData.fullName || ''} ${naturalPersonData.paternalSurname || ''} ${naturalPersonData.maternalSurname || ''}`.trim();
      // Obtener el nombre de la empresa desde el dominio o usar el domain como fallback
      const companyName = userProfile?.subscription.person.fullName || 'BTECH';
      const grpcMetadata: GrpcMetadataDto = {
        ipAddress: requestMetadata?.ipAddress,
        userAgent: requestMetadata?.userAgent,
        subscriberId: subscriber.subscriberId,
      };
      const emailData: SendUserUpdateEmailDto = {
        email,
        username: subscriber.username,
        fullName,
        password,
        codeService,
        companyName,
        primaryColor,
        logoUrl,
        subscriptionDetailId,
        grpcMetadata,
      };
      await this.emailsClient.sendUserUpdateEmail(emailData);
      this.logger.log(
        `Correo de actualización enviado exitosamente a ${email} para el usuario ${subscriber.username}`,
      );
    } catch (error) {
      this.logger.error(
        `Error al enviar correo de actualización para subscriber ${subscriber.subscriberId}:`,
        error,
      );
    }
  }
}
