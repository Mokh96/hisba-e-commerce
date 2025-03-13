import { SyncEntityCommon } from 'src/common-entities/sync.entity';
import { Client } from 'src/modules/clients/entities/client.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class ShippingAddress extends SyncEntityCommon {
  @Column()
  address: string;

  @ManyToOne(() => Client, (client: Client) => client.shippingAddresses, {
    nullable: false,
  })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ name: 'client_id' })
  clientId: number;
}
