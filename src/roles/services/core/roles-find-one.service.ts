import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Role } from '../../entities/role.entity';

@Injectable()
export class RolesFindOneService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async execute(roleId: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { roleId: roleId.trim() },
    });
    if (!role)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Rol con ID '${roleId}' no encontrado`,
      });
    return role;
  }
}
