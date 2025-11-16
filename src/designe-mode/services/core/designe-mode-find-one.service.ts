import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { DesignerMode } from 'src/designe-mode/entities/designe-mode.entity';

@Injectable()
export class DesigneModeFindOneService {
  constructor(
    @InjectRepository(DesignerMode)
    private readonly designerModeRepository: Repository<DesignerMode>,
  ) {}

  async execute(
    designerModeId: string,
    subscriptionDetailId: string,
  ): Promise<DesignerMode> {
    const designerMode = await this.designerModeRepository.findOne({
      where: {
        designerModeId: designerModeId.trim(),
        subscriptionDetailId: subscriptionDetailId.trim(),
      },
    });
    if (!designerMode)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Modo de diseño con ID '${designerModeId}' no encontrado`,
      });
    return designerMode;
  }
}
