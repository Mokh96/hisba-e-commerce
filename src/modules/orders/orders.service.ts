import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, In, Repository } from 'typeorm';
import { ClientsService } from 'src/modules/clients/clients.service';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Client } from 'src/modules/clients/entities/client.entity';
import { Article } from 'src/modules/articles/entities/article.entity';
import { OrderItem } from 'src/modules/order-items/entities/order-item.entity';
import { PaymentMethod } from 'src/modules/payment-methods/entities/payment-method.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { OrderHistory } from 'src/modules/order-history/entities/order-history.entity';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { CartItemsService } from 'src/modules/cart-items/cart-items.service';
import { ArticlesService } from 'src/modules/articles/articles.service';
import { ProductsService } from 'src/modules/products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly clientService: ClientsService,
    private readonly cartItemsService: CartItemsService,
    private readonly articlesService: ArticlesService,
    private readonly productsService: ProductsService,
    private dataSource: DataSource,
  ) {}

  async findOne(id: number) {
    return await this.orderRepository.findOneOrFail({
      where: { id },
      relations: { orderItems: true, client: true },
    });
  }

  async findAll() {
    const [data, totalItems] = await this.orderRepository.findAndCount();
    return { data, totalItems };
  }

  async create(createOrderDto: CreateOrderDto, userId: User['id']) {
    //Step 1: Get client linked to the current user
    const client = await this.clientService.getClientByUserId<Client>(userId);

    //Step 2: Get cart items
    const cartItems = await this.cartItemsService.getCartItems(createOrderDto.cartItemsIds);

    //Step 3: Calculate totals and prepare order items
    let productTotalHt = 0;
    let productTotalTtc = 0;
    let productTotalTva = 0;
    const stampDuty = 0;
    const discountPercentage = 0;

    const orderItems: DeepPartial<OrderItem>[] = [];
    const allOrderItems = [...cartItems, ...(createOrderDto.orderItems || [])];

    const articles = await this.articlesService.getArticlesByIds(allOrderItems.map((i) => i.articleId));

    const products: Pick<Product, 'id' | 'isOutStock'>[] = await this.productsService.getProductsByIds(
      articles.map((i) => i.productId),
      { select: { isOutStock: true, id: true } },
    );

    for (const cartAndOrderItem of allOrderItems) {
      const article = articles.find((a) => a.id === cartAndOrderItem.articleId);
      const product = products.find((p) => p.id === article.productId);

      const unitePriceHt = article.price;
      const tvaPercentage = article.tvaPercentage;
      const unitePriceTtc = unitePriceHt * (1 + tvaPercentage / 100);
      const totalHt = unitePriceHt * cartAndOrderItem.quantity;
      const totalTtc = unitePriceTtc * cartAndOrderItem.quantity;
      const netAmountHt = totalHt - (totalHt * discountPercentage) / 100;
      const netAmountTtc = totalTtc - (totalTtc * discountPercentage) / 100;
      const totalTva = netAmountTtc - netAmountHt;

      orderItems.push({
        isOutStock: product.isOutStock,
        quantity: cartAndOrderItem.quantity,
        note: cartAndOrderItem.note,
        offset: cartAndOrderItem.offset,
        articleId: article.id,
        articleRef: article.ref,
        articleLabel: article.label,
        discountPercentage,
        unitePriceHt,
        unitePriceTtc,
      });

      productTotalHt += totalHt;
      productTotalTtc += totalTtc;
      productTotalTva += totalTva;
    }

    //Step 4: Create and save the complete order with items in one go
    const order = await this.orderRepository.save({
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
      paymentMethodId: createOrderDto.paymentMethodId,
      amountHt: productTotalHt,
      netAmountTtc: productTotalTtc,
      netToPay: productTotalTtc - (productTotalTtc * discountPercentage) / 100 + stampDuty,
      totalTva: productTotalTva,
      statusId: OrderStatus.NEW,
      orderItems,
      history: [
        {
          statusId: OrderStatus.NEW,
          creatorId: userId,
        },
      ],
    });

    return order;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }
}
