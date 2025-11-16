import { Injectable } from '@nestjs/common';
import { Role } from '../../entities/role.entity';
import { RolesIsValidService } from './roles-is-valid.service';

@Injectable()
export class RolesValidationService {
  constructor(private readonly rolesIsValidService: RolesIsValidService) {}

  async isValidRole(roleId: string): Promise<Role> {
    return await this.rolesIsValidService.execute(roleId);
  }
}
