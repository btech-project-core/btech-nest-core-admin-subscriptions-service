import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateRoleDto, CreateRoleResponseDto } from '../dto/create-role.dto';
import { UpdateRoleDto, UpdateRoleResponseDto } from '../dto/update-role.dto';
import {
  FindAllRoleDto,
  FindAllRoleResponseDto,
} from '../dto/find-all-role.dto';
import {
  UpdateRoleStatusDto,
  UpdateRoleStatusResponseDto,
} from '../dto/update-role-status.dto';
import { FindOneRoleResponseDto } from '../dto/find-one-role.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination.dto';
import { RolesCoreService } from '../services/core';

@Controller()
export class RolesCoreController {
  constructor(private readonly rolesCoreService: RolesCoreService) {}

  @MessagePattern('role.create')
  async create(
    @Payload() createRoleDto: CreateRoleDto,
  ): Promise<CreateRoleResponseDto> {
    return await this.rolesCoreService.create(createRoleDto);
  }

  @MessagePattern('role.findAll')
  async findAll(
    @Payload() findAllRoleDto: FindAllRoleDto,
  ): Promise<
    FindAllRoleResponseDto[] | PaginationResponseDto<FindAllRoleResponseDto>
  > {
    return await this.rolesCoreService.findAll(findAllRoleDto);
  }

  @MessagePattern('role.findOne')
  async findOne(
    @Payload('roleId', ParseUUIDPipe) roleId: string,
  ): Promise<FindOneRoleResponseDto> {
    return await this.rolesCoreService.findOne(roleId);
  }

  @MessagePattern('role.update')
  async update(
    @Payload() updateRoleDto: UpdateRoleDto,
  ): Promise<UpdateRoleResponseDto> {
    return await this.rolesCoreService.update(updateRoleDto);
  }

  @MessagePattern('role.updateStatus')
  async updateStatus(
    @Payload() updateStatusDto: UpdateRoleStatusDto,
  ): Promise<UpdateRoleStatusResponseDto> {
    return await this.rolesCoreService.updateStatus(updateStatusDto);
  }

  @GrpcMethod('RolesService', 'FindAllRoles')
  async findAllGrpc(
    @Payload() findAllRoleDto: FindAllRoleDto,
  ): Promise<
    FindAllRoleResponseDto[] | PaginationResponseDto<FindAllRoleResponseDto>
  > {
    return await this.rolesCoreService.findAll(findAllRoleDto);
  }
}
