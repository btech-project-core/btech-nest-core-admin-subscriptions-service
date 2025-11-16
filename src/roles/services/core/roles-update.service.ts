import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../entities/role.entity';
import {
  UpdateRoleDto,
  UpdateRoleResponseDto,
} from '../../dto/update-role.dto';
import { formatRoleResponse } from '../../helpers/format-role-response.helper';
import { RolesFindOneService } from './roles-find-one.service';

@Injectable()
export class RolesUpdateService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly rolesFindOneService: RolesFindOneService,
  ) {}

  async execute(updateRoleDto: UpdateRoleDto): Promise<UpdateRoleResponseDto> {
    const { roleId, code, description } = updateRoleDto;
    const role = await this.rolesFindOneService.execute(roleId);

    role.code = code ?? role.code;
    role.description = description ?? role.description;

    await this.roleRepository.save(role);
    return formatRoleResponse(role);
  }
}
