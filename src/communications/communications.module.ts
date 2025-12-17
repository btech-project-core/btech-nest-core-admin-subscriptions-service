import { Module } from '@nestjs/common';
import { NatsModule } from './nats';
import { GrpcModule } from './grpc/grpc.module';

@Module({
  imports: [NatsModule.register(), GrpcModule],
  exports: [NatsModule, GrpcModule],
})
export class CommunicationsModule {}
