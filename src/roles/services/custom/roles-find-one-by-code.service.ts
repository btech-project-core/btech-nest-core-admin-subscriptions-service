import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Role } from '../../entities/role.entity';

@Injectable()
export class RolesFindOneByCodeService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async execute(
    code: string,
    subscriptionDetailId?: string,
    subscriptionBussineId?: string,
  ): Promise<Role> {
    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .where('role.code = :code', { code: code.trim() });
    if (subscriptionDetailId)
      queryBuilder
        .innerJoin('role.roleSubscriptionDetails', 'roleSubscriptionDetail')
        .innerJoin(
          'roleSubscriptionDetail.subscriptionDetail',
          'subscriptionDetail',
        )
        .andWhere(
          'subscriptionDetail.subscriptionDetailId = :subscriptionDetailId',
          { subscriptionDetailId },
        );
    if (subscriptionBussineId)
      queryBuilder.andWhere(
        'role.subscriptionBussineId = :subscriptionBussineId',
        { subscriptionBussineId },
      );
    const role = await queryBuilder.getOne();
    if (!role)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Rol con código '${code}' no encontrado`,
      });
    return role;
  }
}
