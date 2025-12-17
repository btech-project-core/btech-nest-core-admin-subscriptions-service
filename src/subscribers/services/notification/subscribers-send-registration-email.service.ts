import { Injectable, Logger } from '@nestjs/common';
import { EmailsClient } from 'src/communications/grpc/clients/emails.client';
import {
  GrpcMetadataDto,
  SendUserRegistrationEmailDto,
} from 'src/communications/grpc/dto/send-user-registration-email.dto';
import { SubscriptionsDesigneSettingsFindByDomainService } from 'src/subscriptions-designe-settings/services/custom/subscriptions-designe-settings-find-by-domain.service';
import { Subscriber } from 'src/subscribers/entities/subscriber.entity';
import { FindOneNaturalPersonResponseDto } from 'src/common/dto/find-one-natural-person.dto';
import { SubscribersFindOneByIdWithLoginService } from '../custom/subscribers-find-one-by-id-with-login.service';
import { CodeService } from 'src/common/enums';

@Injectable()
export class SubscribersSendRegistrationEmailService {
  private readonly logger = new Logger(
    SubscribersSendRegistrationEmailService.name,
  );

  constructor(
    private readonly emailsClient: EmailsClient,
    private readonly subscriptionsDesigneSettingsFindByDomainService: SubscriptionsDesigneSettingsFindByDomainService,
    private readonly subscribersFindOneByIdWithLoginService: SubscribersFindOneByIdWithLoginService,
  ) {}

  async execute(
    subscriber: Subscriber,
    naturalPersonData: FindOneNaturalPersonResponseDto,
    password: string,
    roleCode: string,
    codeService: string,
    domain: string,
    subscriptionDetailId: string,
    requestMetadata?: { ipAddress?: string; userAgent?: string },
  ): Promise<void> {
    try {
      // Obtener el primer email disponible de la persona natural
      const email = naturalPersonData.person?.personInformation?.find(
        (info) => info.informationType === 'Correo',
      )?.description;
      if (!email) {
        this.logger.warn(
          `No se encontró email para el subscriber ${subscriber.subscriberId}, correo de registro no enviado`,
        );
        return;
      }
      // Ejecutar llamadas en paralelo
      const [designeSettings, userProfile] = await Promise.all([
        this.subscriptionsDesigneSettingsFindByDomainService.execute(domain),
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

      const emailData: SendUserRegistrationEmailDto = {
        email,
        username: subscriber.username,
        fullName,
        password,
        role: roleCode,
        codeService,
        companyName,
        primaryColor,
        logoUrl,
        subscriptionDetailId,
        grpcMetadata,
      };
      await this.emailsClient.sendUserRegistrationEmail(emailData);
      this.logger.log(
        `Correo de registro enviado exitosamente a ${email} para el usuario ${subscriber.username}`,
      );
    } catch (error) {
      this.logger.error(
        `Error al enviar correo de registro para subscriber ${subscriber.subscriberId}:`,
        error,
      );
    }
  }
}
