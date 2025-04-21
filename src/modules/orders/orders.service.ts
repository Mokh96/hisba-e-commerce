import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { ClientsService } from 'src/modules/clients/clients.service';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Client } from 'src/modules/clients/entities/client.entity';
import { Article } from 'src/modules/articles/entities/article.entity';
import { OrderItem } from 'src/modules/order-items/entities/order-item.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { CartItemsService } from 'src/modules/cart-items/cart-items.service';
import { ArticlesService } from 'src/modules/articles/articles.service';
import { ProductsService } from 'src/modules/products/products.service';
import { CurrentUserData } from 'src/common/decorators';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly cartItemsService: CartItemsService,
    private readonly articlesService: ArticlesService,
    private readonly productsService: ProductsService,
  ) {}

  async findOne(id: number) {
    return await this.orderRepository.findOneOrFail({
      where: { id },
      relations: {
        orderItems: { article: true },
        client: true,
        history: true,
      },
      select: {
        orderItems: {
          ...OrderItem.getSelectableAttributes(),
          article: {
            id: true,
            label: true,
            imgPath: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<PaginatedResult<Order>> {
    const [data, totalItems] = await this.orderRepository.findAndCount();
    return { data, totalItems };
  }

  async create(createOrderDto: CreateOrderDto, user: CurrentUserData) {
    //Step 1: Get client linked to the current user
    //const client = await this.clientService.getClientByUserId<Client>(userId);
    const clientId = user.client?.id;
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
    return await this.orderRepository.save({
      clientId: user.client?.id,
      clientFirstName: createOrderDto.clientFirstName,
      clientLastName: createOrderDto.clientLastName,
      clientPhone: createOrderDto.clientPhone,
      clientMobile: createOrderDto.clientMobile,
      clientFax: createOrderDto.clientFax,
      deliveryAddress: createOrderDto.deliveryAddress,
      deliveryTownId: createOrderDto.deliveryTownId,
      ref: createOrderDto.ref,
      note: createOrderDto.note,
      paymentMethodId: createOrderDto.paymentMethodId,
      amountHt: productTotalHt,
      netAmountTtc: productTotalTtc,
      netToPay: productTotalTtc - (productTotalTtc * discountPercentage) / 100 + stampDuty,
      totalTva: +productTotalTva.toFixed(2),
      orderItems,
      history: [
        {
          statusId: OrderStatus.NEW,
          creatorId: user.sub,
        },
      ],
    });
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }
}
