import { decimalColumnOptions } from 'src/entities-helpers/columnOptions.helper';
import { Client } from 'src/modules/clients/entities/client.entity';
import { OrderHistory } from 'src/modules/order-history/entities/order-history.entity';
import { OrderItem } from 'src/modules/order-items/entities/order-item.entity';
import { PaymentMethod } from 'src/modules/payment-methods/entities/payment-method.entity';
import { OrderStatus } from 'src/modules/system-entities/entities/order-status.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { WithTimestamp } from 'src/common/entities/timestamp.entity';
import { WithSyncId } from 'src/common/entities/sync.entity';
import { BaseEntity } from 'src/common/entities/base-entity.entity';
import { ORDER_FIELD_LENGTHS } from 'src/modules/orders/config/orders.config';
import { Town } from 'src/modules/system-entities/entities/town.entity';
import {OrderStatus as OrderStatusEnum} from "src/common/enums/order-status.enum";

@Entity()
export class Order extends WithTimestamp(WithSyncId(BaseEntity)) {
  //base order properties
  @Column({ nullable: true })
  note: string;

  @Column({ nullable: true, length: ORDER_FIELD_LENGTHS.REF })
  ref: string;

  //amount & payment properties
  @Column({ ...decimalColumnOptions, name: 'amount_ht' })
  amountHt: number;

  @Column({ ...decimalColumnOptions, name: 'net_amount_ttc' })
  netAmountTtc: number;

  @Column({ ...decimalColumnOptions, name: 'net_to_pay' })
  netToPay: number;

  @Column({ ...decimalColumnOptions, name: 'total_tva' })
  totalTva: number;

  @Column({ ...decimalColumnOptions, default: 0 })
  discount: number;

  @Column({ name: 'discount_percentage', default: 0, type: 'double' })
  discountPercentage: number;

  @Column({ ...decimalColumnOptions, name: 'stamp_duty', default: 0 })
  stampDuty: number;

  //client info properties
  @Column({ name: 'client_first_name', length: ORDER_FIELD_LENGTHS.CLIENT_FIRST_NAME })
  clientFirstName: string;

  @Column({ name: 'client_last_name', length: ORDER_FIELD_LENGTHS.CLIENT_LAST_NAME })
  clientLastName: string;

  @Column({ name: 'client_mobile', length: ORDER_FIELD_LENGTHS.CLIENT_PHONE })
  clientMobile: string;

  @Column({ name: 'client_phone', length: ORDER_FIELD_LENGTHS.CLIENT_MOBILE })
  clientPhone: string;

  @Column({ name: 'client_fax', length: ORDER_FIELD_LENGTHS.CLIENT_FAX })
  clientFax: string;

  //delivery info properties
  @Column({ name: 'delivery_address', length: ORDER_FIELD_LENGTHS.DELIVERY_ADDRESS })
  deliveryAddress: string;

  //relations
  @Column({ name: 'delivery_town_id' })
  deliveryTownId: number;

  @Column({ name: 'payment_method_id' })
  paymentMethodId: number;

  @Column({ name: 'status_id' })
  statusId: OrderStatusEnum;

  @Column({ name: 'client_id' })
  clientId: number;

/*  @Column({ name: 'town_id' })
  townId: number;*/

  @OneToMany(() => OrderItem, (orderItem: OrderItem) => orderItem.order)
  orderItems: OrderItem[];

  @ManyToOne(() => PaymentMethod, (paymentMethod: PaymentMethod) => paymentMethod.orders, {
    nullable: false,
  })
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod;

  @ManyToOne(() => OrderStatus, (status: OrderStatus) => status.orders, {
    nullable: false,
  })
  @JoinColumn({ name: 'status_id' })
  status: OrderStatus;

  @OneToMany(() => OrderHistory, (history: OrderHistory) => history.order, {
    nullable: false,
  })
  history: OrderHistory[];

  @ManyToOne(() => Client, (client: Client) => client.orders, {
    nullable: false,
  })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => Town, (town: Town) => town.orders, {
    nullable: true,
  })
  @JoinColumn({ name: 'delivery_town_id' })
  deliveryTown: Town;
}
