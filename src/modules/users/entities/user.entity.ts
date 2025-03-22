import { OrderHistory } from 'src/modules/order-history/entities/order-history.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { Client } from 'src/modules/clients/entities/client.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  Index,
  JoinColumn,
  BeforeInsert,
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Roles } from 'src/enums/roles.enum';

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

  @OneToMany(() => Client, (client: Client) => client.creator)
  createdClients: Client[];

  @OneToOne(() => Client, (client: Client) => client.user)
  client: Client;

  @ManyToOne(() => Role, (role: Role) => role.users, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ name: 'role_id', nullable: false })
  roleId: Roles;

  @BeforeInsert()
  async setPassword() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
}
