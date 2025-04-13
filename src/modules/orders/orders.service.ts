import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'src/modules/cart-items/entities/cart-item.entity';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
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

    //Step 1: Get client linked to the current user
    const client = await this.clientService.getClientByUserId<Client>(userId);

    let orderItems: OrderItem[] = [];

    return this.dataSource.manager.transaction(async (manager) => {
      //Step 2: Create the order with temporary totals
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
        amountHt: 0, // Temporarily set to 0; will be recalculated after order items are created
        netAmountTtc: 0, //Temporarily set to 0, as it will be recalculated after creating order items.
        netToPay: 0, //Temporarily set to 0, as it will be recalculated after creating order items.
        totalTva: 0, //Temporarily set to 0, as it will be recalculated after creating order items.
        statusId: OrderStatus.NEW, //Temporarily set to 0, as it will be recalculated after creating order items.
      });

      //Step 2.1: Prepare order variables (will be updated after creating order items)
      let productTotalHt = 0;
      let productTotalTtc = 0;
      let productTotalTva = 0;
      const stampDuty = 0; //Future implementation
      const discountPercentage = 0; //Future implementation

      //Step 3: Create order items from both cartItems and directly provided orderItems
      const cartItems = await this.getCartItems(createOrderDto.cartItemsIds, manager);

      for (const cartAndOrderItem of [...cartItems, ...(createOrderDto.orderItems || [])]) {
        const article = await this.articleRepository.findOneByOrFail({ id: cartAndOrderItem.articleId });

        const product: Pick<Product, 'isOutStock'> = await manager.findOneOrFail(Product, {
          where: { id: article.productId },
          select: { isOutStock: true },
        });

        const unitePriceHt = article.price;
        const tvaPercentage = article.tvaPercentage;

        const totalHt = unitePriceHt * cartAndOrderItem.quantity;
        const unitePriceTtc = unitePriceHt * (1 + tvaPercentage / 100);
        const totalTtc = unitePriceTtc * cartAndOrderItem.quantity;
        const netAmountHt = totalHt - (totalHt * discountPercentage) / 100;
        const netAmountTtc = totalTtc - (totalTtc * discountPercentage) / 100;
        const totalTva = netAmountTtc - netAmountHt;

        const orderItem = await manager.save(OrderItem, {
          isOutStock: product.isOutStock,
          orderId: order.id,
          quantity: cartAndOrderItem.quantity,
          note: cartAndOrderItem.note,
          offset: cartAndOrderItem.offset,
          articleId: article.id,
          price: article.price,
          articleRef: article.ref,
          articleLabel: article.label,
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

      //Step 4: Update the order with calculated totals
      const updatedOrderData: Partial<Order> = {
        amountHt: productTotalHt,
        netAmountTtc: productTotalTtc,
        totalTva: productTotalTva,
        netToPay: productTotalTtc - (productTotalTtc * discountPercentage) / 100 + stampDuty,
      };

      await manager.update(Order, order.id, updatedOrderData);

      //Step 5: Create order history log for audit trail
      const orderHistory = await manager.save(OrderHistory, {
        statusId: OrderStatus.NEW,
        creatorId: userId,
        orderId: order.id,
      });

      //Step 6: Delete cartItems after successful creation of the order
      //await manager.delete(CartItem, createOrderDto.cartItemsIds);

      //Step 7: Return order summary
      return {
        ...order,
        ...updatedOrderData,
        orderItems,
        orderHistory,
      };
    });
  }

  /**
   * Retrieves a list of cart items by their IDs using the provided transaction manager.
   *
   * @param cartItemsIds - An array of cart item IDs to retrieve.
   * @param manager - The transactional EntityManager instance.
   * @returns An array of found CartItem entities.
   *
   * @throws {BadRequestException} If one or more cart items are not found.
   */
  private async getCartItems(cartItemsIds: CartItem['id'][], manager: EntityManager): Promise<CartItem[]> {
    if (!cartItemsIds?.length) {
      return [];
    }

    const cartItems = await manager.find(CartItem, {
      where: { id: In(cartItemsIds) },
    });

    const foundIds = new Set(cartItems.map((item) => item.id));
    const missingIds = cartItemsIds.filter((id) => !foundIds.has(id));

    if (missingIds.length > 0) {
      throw new BadRequestException(`Cart items not found: ${missingIds.join(', ')}`);
    }

    return cartItems;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }
}
