import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../entities/role.entity';
import {
  UpdateRoleStatusDto,
  UpdateRoleStatusResponseDto,
} from '../../dto/update-role-status.dto';
import { RolesFindOneService } from './roles-find-one.service';
import { RolesRelatedSubscribersService } from '../custom/roles-related-subscribers.service';

@Injectable()
export class RolesUpdateStatusService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly rolesFindOneService: RolesFindOneService,
    private readonly rolesRelatedSubscribersService: RolesRelatedSubscribersService,
  ) {}

  async execute(
    updateRoleStatusDto: UpdateRoleStatusDto,
  ): Promise<UpdateRoleStatusResponseDto> {
    const { roleId, isActive } = updateRoleStatusDto;
    const existingRole = await this.rolesFindOneService.execute(roleId);
    if (!isActive) await this.rolesRelatedSubscribersService.execute(roleId);
    await this.roleRepository.update(roleId, {
      isActive,
    });
    const statusMessage = isActive ? 'activado' : 'desactivado';
    return {
      message: `Rol '${existingRole.description}' ${statusMessage} exitosamente`,
    };
  }
}
