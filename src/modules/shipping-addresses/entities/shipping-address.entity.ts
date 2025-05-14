import { Client } from 'src/modules/clients/entities/client.entity';
import { Town } from 'src/modules/system-entities/entities/town.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { SHIPPING_ADDRESSES_LENGTHS } from '../config/shipping-addresses.config';
import { WithTimestamp } from 'src/common/entities/timestamp.entity';
import { WithEntityAttributeUtils } from 'src/common/entities/entity-attribute.entity';
import { BaseEntity } from 'src/common/entities/base-entity.entity';
import { WithSyncId } from 'src/common/entities/sync.entity';
import { WithGpsCoordinates } from 'src/common/entities/gps-coordinates.entity';

const MixedEntities = WithGpsCoordinates(WithSyncId(WithTimestamp(WithEntityAttributeUtils(BaseEntity))));

@Entity()
export class ShippingAddress extends MixedEntities {
  @Column({ length: SHIPPING_ADDRESSES_LENGTHS.ADDRESS })
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

  @OneToMany(() => Town, (town: Town) => town.shippingAddresses)
  @JoinColumn({ name: 'town_id', referencedColumnName: 'id' })
  town: Town;
}
