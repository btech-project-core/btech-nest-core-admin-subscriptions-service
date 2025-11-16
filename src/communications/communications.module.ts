import { Module } from '@nestjs/common';
import { NatsModule } from './nats';

@Module({
  imports: [NatsModule.register()],
  exports: [NatsModule],
})
export class CommunicationsModule {}
