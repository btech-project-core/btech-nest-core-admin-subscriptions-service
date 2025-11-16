import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../entities/role.entity';
import {
  CreateRoleDto,
  CreateRoleResponseDto,
} from '../../dto/create-role.dto';
import { formatRoleResponse } from '../../helpers/format-role-response.helper';

@Injectable()
export class RolesCreateService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async execute(createRoleDto: CreateRoleDto): Promise<CreateRoleResponseDto> {
    const role = this.roleRepository.create(createRoleDto);
    await this.roleRepository.save(role);
    return formatRoleResponse(role);
  }
}
