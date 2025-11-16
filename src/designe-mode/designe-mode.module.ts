import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DesignerMode } from './entities/designe-mode.entity';
import { DESIGNE_MODE_CONTROLLERS } from './controllers';
import { DESIGNE_MODE_CORE_SERVICES } from './services/core';
import { DESIGNE_MODE_CUSTOM_SERVICES } from './services/custom';
import { DESIGNE_MODE_VALIDATION_SERVICES } from './services/validation';

@Module({
  imports: [TypeOrmModule.forFeature([DesignerMode])],
  controllers: [...DESIGNE_MODE_CONTROLLERS],
  providers: [
    ...DESIGNE_MODE_CORE_SERVICES,
    ...DESIGNE_MODE_CUSTOM_SERVICES,
    ...DESIGNE_MODE_VALIDATION_SERVICES,
  ],
  exports: [...DESIGNE_MODE_VALIDATION_SERVICES],
})
export class DesigneModeModule {}
