import { Injectable } from '@nestjs/common';
import {
  CreateRoleDto,
  CreateRoleResponseDto,
} from '../../dto/create-role.dto';
import {
  UpdateRoleDto,
  UpdateRoleResponseDto,
} from '../../dto/update-role.dto';
import {
  FindAllRoleDto,
  FindAllRoleResponseDto,
} from '../../dto/find-all-role.dto';
import {
  UpdateRoleStatusDto,
  UpdateRoleStatusResponseDto,
} from '../../dto/update-role-status.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import { Role } from '../../entities/role.entity';
import { RolesCreateService } from './roles-create.service';
import { RolesFindAllService } from './roles-find-all.service';
import { RolesFindOneService } from './roles-find-one.service';
import { RolesUpdateService } from './roles-update.service';
import { RolesUpdateStatusService } from './roles-update-status.service';

@Injectable()
export class RolesCoreService {
  constructor(
    private readonly rolesCreateService: RolesCreateService,
    private readonly rolesFindAllService: RolesFindAllService,
    private readonly rolesFindOneService: RolesFindOneService,
    private readonly rolesUpdateService: RolesUpdateService,
    private readonly rolesUpdateStatusService: RolesUpdateStatusService,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<CreateRoleResponseDto> {
    return await this.rolesCreateService.execute(createRoleDto);
  }

  async findAll(
    findAllRoleDto: FindAllRoleDto,
  ): Promise<
    FindAllRoleResponseDto[] | PaginationResponseDto<FindAllRoleResponseDto>
  > {
    return await this.rolesFindAllService.execute(findAllRoleDto);
  }

  async findOne(roleId: string): Promise<Role> {
    return await this.rolesFindOneService.execute(roleId);
  }

  async update(updateRoleDto: UpdateRoleDto): Promise<UpdateRoleResponseDto> {
    return await this.rolesUpdateService.execute(updateRoleDto);
  }

  async updateStatus(
    updateRoleStatusDto: UpdateRoleStatusDto,
  ): Promise<UpdateRoleStatusResponseDto> {
    return await this.rolesUpdateStatusService.execute(updateRoleStatusDto);
  }
}
