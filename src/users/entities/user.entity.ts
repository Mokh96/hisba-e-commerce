import { OrderHistory } from 'src/order-history/entities/order-history.entity';
import { Order } from 'src/orders/entities/order.entity';
import { ProspectiveTier } from 'src/prospective-tiers/entities/prospective-tier.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Tier } from 'src/tiers/entities/tier.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  Index,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @Column()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index('username', { unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => OrderHistory, (history: OrderHistory) => history.creator)
  createdOrderHistory: OrderHistory[];

  @OneToMany(() => Order, (order: Order) => order.creator)
  createdOrders: Order[];

  @OneToMany(() => Tier, (tier: Tier) => tier.creator)
  createdTiers: Tier[];

  @OneToMany(
    () => ProspectiveTier,
    (prospectiveTier: ProspectiveTier) => prospectiveTier.creator,
  )
  createdProspectiveTiers: ProspectiveTier[];

  @ManyToOne(() => Role, (role: Role) => role.users, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ name: 'role_id', nullable: false })
  roleId: number;

  @BeforeInsert()
  async setPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}
