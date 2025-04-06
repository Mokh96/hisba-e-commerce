import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Wilaya } from 'src/modules/wilayas/entities/wilaya.entity';
import { ShippingAddress } from 'src/modules/shipping-addresses/entities/shipping-address.entity';
import { Client } from 'src/modules/clients/entities/client.entity';

@Entity()
export class Town {
  @Column({ primary: true })
  id: number;

  @Column()
  label: string;

  @Column({ name: 'wilaya_id' })
  wilayaId: number;

  @ManyToOne(() => Wilaya, (wilaya: Wilaya) => wilaya.towns, { nullable: false, cascade: true })
  @JoinColumn({ name: 'wilaya_id', referencedColumnName: 'id' })
  wilaya: Wilaya;

  @OneToMany(() => ShippingAddress, (shippingAddress: ShippingAddress) => shippingAddress.town)
  shippingAddresses: ShippingAddress[];

  @OneToOne(() => Client, (client: Client) => client.town)
  clientSync: Client;
}
