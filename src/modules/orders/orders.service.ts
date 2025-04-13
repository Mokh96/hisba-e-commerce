import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'src/modules/cart-items/entities/cart-item.entity';
import { DataSource, Repository } from 'typeorm';
import { ClientsService } from 'src/modules/clients/clients.service';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Client } from 'src/modules/clients/entities/client.entity';
import { Article } from 'src/modules/articles/entities/article.entity';
import { OrderItem } from 'src/modules/order-items/entities/order-item.entity';
import { PaymentMethod } from 'src/modules/payment-methods/entities/payment-method.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { OrderHistory } from 'src/modules/order-history/entities/order-history.entity';
import { OrderStatus } from 'src/common/enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
    private readonly clientService: ClientsService,
    private dataSource: DataSource,
  ) {}

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  findAll() {
    return `This action returns all orders`;
  }

  async create(createOrderDto: CreateOrderDto, userId: User['id']) {
    const paymentMethod = await this.paymentMethodRepository.findOneByOrFail({ id: createOrderDto.paymentMethodId });

    const client = await this.clientService.getClientByUserId<Client>(userId);
    let orderItems: OrderItem[] = [];

    return this.dataSource.manager.transaction(async (manager) => {
      const order = await manager.save(Order, {
        note: createOrderDto.note,
        clientFirstName: client.firstName,
        clientLastName: client.lastName,
        clientPhone: client.phone,
        clientMobile: client.mobile,
        clientFax: client.fax,
        deliveryTownId: createOrderDto.deliveryTownId,
        deliveryAddress: createOrderDto.deliveryAddress || client.address,
        ref: createOrderDto.ref,
        clientId: client.id,
        paymentMethodId: paymentMethod.id,
        amountHt: 0, //temp usage
        netAmountTtc: 0, //temp usage
        netToPay: 0, //temp usage
        totalTva: 0, //temp usage
        statusId: OrderStatus.NEW, //temp status
      });

      let productTotalHt = 0;
      let productTotalTtc = 0;
      let productTotalTva = 0;
      const stampDuty = 0; //temp usage for now
      const discountPercentage = 0; //temp usage

      for (const cartItemId of createOrderDto.cartItemsIds) {
        const cartItem = await manager.findOneOrFail(CartItem, { where: { id: cartItemId } });
        const article = await this.articleRepository.findOneByOrFail({ id: cartItem.articleId });

        const product: Pick<Product, 'isOutStock'> = await manager.findOneOrFail(Product, {
          where: { id: article.productId },
          select: { isOutStock: true },
        });

        const unitePriceHt = article.price;
        const tvaPercentage = article.tvaPercentage;

        const totalHt = unitePriceHt * cartItem.quantity;
        const unitePriceTtc = unitePriceHt * (1 + tvaPercentage / 100);
        const totalTtc = unitePriceTtc * cartItem.quantity;
        const netAmountHt = totalHt - (totalHt * discountPercentage) / 100;
        const netAmountTtc = totalTtc - (totalTtc * discountPercentage) / 100;
        const totalTva = netAmountTtc - netAmountHt;

        const orderItem = await manager.save(OrderItem, {
          isOutStock: product.isOutStock,
          orderId: order.id,
          quantity: cartItem.quantity,
          note: cartItem.note,
          offset: cartItem.offset,
          articleId: article.id,
          price: article.price,
          articleRef: article.ref,
          articleLabel: article.label,
          //
          discountPercentage,
          unitePriceHt,
          unitePriceTtc,
          tvaPercentage,
        });

        orderItems.push(orderItem);

        productTotalHt = productTotalHt + totalHt;
        productTotalTtc = productTotalTtc + totalTtc;
        productTotalTva = productTotalTva + totalTva;
      }

      const updatedOrderData: Partial<Order> = {
        amountHt: productTotalHt,
        netAmountTtc: productTotalTtc,
        totalTva: productTotalTva,
        netToPay: productTotalTtc - (productTotalTtc * discountPercentage) / 100 + stampDuty,
      };

      await manager.update(Order, order.id, updatedOrderData);

      const orderHistory = await manager.save(OrderHistory, {
        statusId: OrderStatus.NEW,
        creatorId: userId,
        orderId: order.id,
      });

      //remove cartItems after successful cation of order
      //await manager.delete(CartItem, createOrderDto.cartItemsIds);

      return {
        ...order,
        ...updatedOrderData,
        orderItems,
        orderHistory,
      };
    });
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }
}
