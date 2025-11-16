import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { DesignerMode } from 'src/designe-mode/entities/designe-mode.entity';

@Injectable()
export class DesigneModeIsValidService {
  constructor(
    @InjectRepository(DesignerMode)
    private readonly designerModeRepository: Repository<DesignerMode>,
  ) {}

  async execute(designerModeId: string): Promise<DesignerMode> {
    const designerMode = await this.designerModeRepository.findOne({
      where: { designerModeId, isActive: true },
    });
    if (!designerMode)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Modo de diseño con ID ${designerModeId} no encontrado o inactivo`,
      });
    return designerMode;
  }
}
