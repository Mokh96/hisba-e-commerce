import * as bcrypt from 'bcrypt';
import { Role as RoleEnum } from 'src/common/enums/roles.enum';
import { Client } from 'src/modules/clients/entities/client.entity';
import { OrderHistory } from 'src/modules/order-history/entities/order-history.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Role } from 'src/modules/system-entities/entities/role.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => OrderHistory, (history: OrderHistory) => history.creator)
  createdOrderHistory: OrderHistory[];

/*  @OneToMany(() => Order, (order: Order) => order.creator)
  createdOrders: Order[];*/

  @OneToOne(() => Client, (client: Client) => client.user)
  client: Client;

  @ManyToOne(() => Role, (role: Role) => role.users, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role: RoleEnum;

  @Column({ name: 'role_id', nullable: false })
  roleId: RoleEnum;

  @BeforeInsert()
  async setPassword() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
}
