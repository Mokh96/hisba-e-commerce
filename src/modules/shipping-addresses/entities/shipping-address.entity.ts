import { SyncEntityCommon } from 'src/common-entities/sync.entity';
import { Client } from 'src/modules/clients/entities/client.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Town } from 'src/modules/towns/entities/town.entity';

@Entity()
export class ShippingAddress extends SyncEntityCommon {
  @Column()
  address: string;

  @Column({ name: 'client_id' })
  clientId: number;

  @Column({ name: 'town_id', nullable: true })
  townId: number;

  @ManyToOne(() => Client, (client: Client) => client.shippingAddresses, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @OneToOne(() => Town, (town: Town) => town.shippingAddresses, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'town_id', referencedColumnName: 'id' })
  town: Town;
}
