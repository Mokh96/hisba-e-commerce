import { SyncEntityCommon } from 'src/common-entities/sync.entity';
import { Client } from 'src/modules/clients/entities/client.entity';
import { Town } from 'src/modules/towns/entities/town.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity()
export class ShippingAddress extends SyncEntityCommon {
  @Column()
  address: string;

  @Column({ name: 'client_id' })
  clientId: number;

  @Column({ name: 'town_id' })
  townId: number;

  @ManyToOne(() => Client, (client: Client) => client.shippingAddresses, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @OneToOne(() => Town, (town: Town) => town.shippingAddresses)
  @JoinColumn({ name: 'town_id', referencedColumnName: 'id' })
  town: Town;
}
