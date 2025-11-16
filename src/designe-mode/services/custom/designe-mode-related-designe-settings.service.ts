import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { DesignerMode } from 'src/designe-mode/entities/designe-mode.entity';

@Injectable()
export class DesigneModeRelatedDesigneSettingsService {
  constructor(
    @InjectRepository(DesignerMode)
    private readonly designerModeRepository: Repository<DesignerMode>,
  ) {}

  async execute(designerModeId: string): Promise<void> {
    const relatedSettingsCount = await this.designerModeRepository
      .createQueryBuilder('designerMode')
      .innerJoin(
        'designerMode.subscriptionsDesigneSetting',
        'subscriptionsDesigneSetting',
      )
      .where('designerMode.designerModeId = :designerModeId', {
        designerModeId,
      })
      .andWhere('subscriptionsDesigneSetting.isActive = true')
      .andWhere('designerMode.isActive = true')
      .getCount();

    if (relatedSettingsCount > 0)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message:
          'No se puede desactivar el modo de diseño porque tiene configuraciones asociadas',
      });
  }
}
