import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { envs } from 'src/config';
import { EMAIL_SERVICE } from 'src/config';
import { EmailsClient } from './clients/emails.client';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: EMAIL_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: 'emails',
          protoPath: join(
            process.cwd(),
            'src/communications/grpc/proto/emails.proto',
          ),
          url: envs.grpc.emailsUrl,
          keepalive: {
            keepaliveTimeMs: 30000,
            keepaliveTimeoutMs: 5000,
            keepalivePermitWithoutCalls: 1,
          },
          loader: {
            keepCase: true,
            defaults: true,
          },
        },
      },
    ]),
  ],
  providers: [EmailsClient],
  exports: [EmailsClient],
})
export class GrpcModule {}
