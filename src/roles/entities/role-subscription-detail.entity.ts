import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Timestamped } from 'src/common/entities/timestamped.entity';
import { Role } from './role.entity';
import { SubscriptionDetail } from 'src/subscriptions-detail/entities/subscription-detail.entity';

@Entity({ name: 'roleSubscriptionDetail' })
export class RoleSubscriptionDetail extends Timestamped {
  @PrimaryGeneratedColumn('uuid')
  roleSubscriptionDetailId: string;

  @ManyToOne(() => Role, (role) => role.roleSubscriptionDetails)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @ManyToOne(
    () => SubscriptionDetail,
    (subscriptionDetail) => subscriptionDetail.roleSubscriptionDetails,
  )
  @JoinColumn({ name: 'subscriptionDetailId' })
  subscriptionDetail: SubscriptionDetail;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;
}
