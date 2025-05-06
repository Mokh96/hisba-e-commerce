import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { Order } from 'src/modules/orders/entities/order.entity';
import { OrderItem } from 'src/modules/order-items/entities/order-item.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { OrderStatus, orderStatusesString } from 'src/modules/orders/enums/order-status.enum';
import { CartItemsService } from 'src/modules/cart-items/cart-items.service';
import { ArticlesService } from 'src/modules/articles/articles.service';
import { ProductsService } from 'src/modules/products/products.service';
import { CurrentUserData } from 'src/common/decorators';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { PaginationDto } from 'src/common/dtos/filters/pagination-query.dto';
import { OrderFilterDto } from './dto/order-filter.dto';
import { QueryUtils } from 'src/common/utils/query-utils/query.utils';
import { Role } from 'src/common/enums/roles.enum';
import { changeOrderStatus } from 'src/modules/orders/util/order-workflow.util';
import { OrderHistory } from 'src/modules/order-history/entities/order-history.entity';
import { ChangeStatusDto } from 'src/modules/orders/dto/change-status.dto';
import { tr } from '@faker-js/faker';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly cartItemsService: CartItemsService,
    private readonly articlesService: ArticlesService,
    private readonly productsService: ProductsService,
    private dataSource: DataSource,
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

  async findAll(paginationDto: PaginationDto, filterDto: OrderFilterDto): Promise<PaginatedResult<DeepPartial<Order>>> {
    const queryBuilder = this.orderRepository.createQueryBuilder(this.orderRepository.metadata.tableName);

    QueryUtils.use(queryBuilder)
      .applySearch(filterDto.search)
      .applyFilters(filterDto.filters)
      .applyGtFilters(filterDto.gt)
      .applyLtFilters(filterDto.lt)
      .applyGteFilters(filterDto.gte)
      .applyLteFilters(filterDto.lte)
      .applyInFilters(filterDto.in)
      .applySelectFields(filterDto.fields)
      .applyDateFilters(filterDto.date)
      .applyPagination(paginationDto);

    const [data, totalItems] = await queryBuilder.getManyAndCount();
    return { totalItems, data };
  }

  async create(createOrderDto: CreateOrderDto, user: CurrentUserData) {
    //Step 1: Get cart items
    const cartItems = await this.cartItemsService.getCartItemsByIds(createOrderDto.cartItemsIds);

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

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return await this.dataSource.transaction(async (manager) => {
      // Step 0: Fetch the existing order along with its orderItems
      const order = await manager.findOneOrFail(Order, {
        where: { id },
        relations: {orderItems : true},
      });

      // Only allow updates for orders that are still in NEW status
      if (order.statusId !== OrderStatus.NEW) {
        throw new BadRequestException(`Only orders in ${orderStatusesString[OrderStatus.NEW]} status can be updated`);
      }

      const existingItems = order.orderItems;
      const updatedItemsDto = updateOrderDto.orderItems ?? [];
      const newItemsDto = updateOrderDto.newOrderItems ?? [];

      const incomingUpdateIds = new Set<number>();
      const itemsToUpdate = [];

      // Step 1: Update existing items
      // - Each item in `orderItems` must contain an `id`.
      // - We trust the client app and overwrite fields (except articleId which is immutable).
      // - If an existing item is not present in this list, it will be deleted in Step 2.
      for (const item of updatedItemsDto) {
        if (!item.id) continue;

        const existing = existingItems.find((ei) => ei.id === item.id);
        if (!existing) continue;

        incomingUpdateIds.add(item.id);

        itemsToUpdate.push({
          ...existing,
          quantity: item.quantity,
          offset: item.offset,
          note: item.note,
        });
      }

      // Step 2: Delete missing items
      // - Any existing orderItem not found in the `orderItems` list will be removed.
      const itemsToDelete = existingItems.filter((ei) => !incomingUpdateIds.has(ei.id));
      await manager.remove(OrderItem, itemsToDelete);

      // Step 3: Create new items
      // - Items in `newOrderItems` are treated as new and must include all required fields.
      // - New items must not include an ID.
      const createdItems = newItemsDto.map((item) =>
        manager.create(OrderItem, {
          orderId: id,
          quantity: item.quantity,
          offset: item.offset,
          note: item.note,
          unitePriceHt: item.unitePriceHt,
          unitePriceTtc: item.unitePriceTtc,
          discount: item.discount,
          articleId: item.articleId,
          articleLabel: item.articleLabel,
          articleRef: item.articleRef,
        }),
      );

      // Step 4: Persist all updates
      await manager.save(OrderItem, itemsToUpdate);   // Save updated items
      await manager.save(OrderItem, createdItems);    // Save new items

      // Step 5: Update the order itself (excluding orderItems fields)
      const { orderItems, newOrderItems, ...orderUpdateData } = updateOrderDto;
      await manager.update(Order, id, orderUpdateData);

      // Step 6: Return updated order summary (does not re-fetch from DB)
      return {
        ...order,
        ...orderUpdateData,
        orderItems: [...itemsToUpdate, ...createdItems],
      };
    });
  }


  private checkOwnership = (order: Order, user: CurrentUserData) => {
    if (user.roleId === Role.CLIENT && order.clientId !== user.client?.id) {
      throw new ForbiddenException('You do not have permission to modify this order');
    }
  };

  async changeOrderStatus(orderId: number, newStatusId: OrderStatus, user: CurrentUserData) {
    const order = await this.orderRepository.findOneByOrFail({ id: orderId });
    this.checkOwnership(order, user);

    // Validate the status change
    changeOrderStatus(user.roleId, order.statusId, newStatusId);

    return this.dataSource.manager.transaction(async (manager) => {
      order.statusId = newStatusId;
      const updatedOrder = await manager.save(Order, order);

      // Log the status change in order history
      const orderHistory = await manager.save(OrderHistory, {
        orderId,
        statusId: newStatusId,
        creatorId: user.sub,
      });

      return {
        ...updatedOrder,
        orderHistory,
      };
    });
  }

  async BulkChangeStatus(changeStatusDto: ChangeStatusDto[], user: CurrentUserData) {
    const response = {
      successes: [],
      failures: [],
    };

    for (const item of changeStatusDto) {
      try {
        const updatedOrder = await this.changeOrderStatus(item.orderId, item.newStatusId, user);
        response.successes.push(updatedOrder);
      } catch (e) {
        response.failures.push(e);
      }
    }

    return response;
  }
}
