import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { Order } from 'src/modules/orders/entities/order.entity';
import { OrderItem } from 'src/modules/order-items/entities/order-item.entity';
import { OrderStatus, orderStatusesString } from 'src/modules/orders/enums/order-status.enum';
import { CartItemsService } from 'src/modules/cart-items/cart-items.service';
import { CurrentUserData } from 'src/common/decorators';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { PaginationDto } from 'src/common/dtos/filters/pagination-query.dto';
import { OrderFilterDto } from '../dto/order-filter.dto';
import { QueryUtils } from 'src/common/utils/query-utils/query.utils';
import { OrderCalculationService } from 'src/modules/orders/services/order-calculation.service';
import { UpdateOrderByClientDto } from 'src/modules/orders/dto/update-order-by-client.dto';
import { mergeOrderItems } from 'src/modules/orders/helpers/order.helpers';
import { roundMoney } from 'src/common/utils/pricing-utils.util';
import { findDeletedEntityIds } from 'src/common/utils/find-deleted-entity-ids.util';
import { Role } from 'src/common/enums/roles.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly cartItemsService: CartItemsService,
    private readonly orderCalculationService: OrderCalculationService,
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

  async findAll(
    paginationDto: PaginationDto,
    filterDto: OrderFilterDto,
    user: CurrentUserData,
  ): Promise<PaginatedResult<DeepPartial<Order>>> {
    const queryBuilder = this.orderRepository.createQueryBuilder(this.orderRepository.metadata.tableName);

    if (user.roleId === Role.CLIENT) {
      filterDto.filters.clientId = user.client?.id; // Automatically set clientId in filters for client users
      filterDto.in.clientId = []; // Exclude clientId from the 'in' filter to avoid conflicts
    }

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

    const stampDuty = 0;
    const discountPercentage = 0;

    const allOrderItems = [...cartItems, ...(createOrderDto.orderItems || [])];

    const { orderItems, productTotalTva, productTotalTtc, productTotalHt } =
      await this.orderCalculationService.calculateOrderItems(allOrderItems);

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

  async updateOrderByCompany(id: number, updateOrderDto: UpdateOrderDto) {
    return await this.dataSource.transaction(async (manager) => {
      // Step 0: Fetch the existing existingOrder along with its orderItems
      const existingOrder = await manager.findOneOrFail(Order, {
        where: { id },
        relations: { orderItems: true },
      });

      // Only allow updates for orders that are still in NEW status
      if (existingOrder.statusId !== OrderStatus.NEW) {
        throw new BadRequestException(`Only orders in ${orderStatusesString[OrderStatus.NEW]} status can be updated`);
      }

      const existingItems = existingOrder.orderItems;
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
      await manager.save(OrderItem, itemsToUpdate); // Save updated items
      await manager.save(OrderItem, createdItems); // Save new items

      // Step 5: Update the existingOrder itself (excluding orderItems fields)
      const { orderItems, newOrderItems, ...orderUpdateData } = updateOrderDto;
      await manager.update(Order, id, orderUpdateData);

      // Step 6: Return updated existingOrder summary (does not re-fetch from DB)
      return {
        ...existingOrder,
        ...orderUpdateData,
        orderItems: [...itemsToUpdate, ...createdItems],
      };
    });
  }

  async updateOrderByClient(id: number, dto: UpdateOrderByClientDto, user: CurrentUserData) {
    return await this.dataSource.transaction(async (manager) => {
      const orderRepo = manager.withRepository(this.orderRepository);
      const itemRepo = manager.withRepository(this.orderItemRepository);

      // Step 0: Fetch the existing existingOrder along with its orderItems
      const existingOrder = await orderRepo.findOneOrFail({
        where: { id, clientId: user.client?.id },
        relations: { orderItems: true },
      });

      // Only allow updates for orders that are still in NEW status
      if (existingOrder.statusId !== OrderStatus.NEW) {
        throw new BadRequestException(`Only orders in ${orderStatusesString[OrderStatus.NEW]} status can be updated`);
      }

      // Step 1: Calculate new order items
      const existingItems = existingOrder.orderItems;
      const updatedItems = dto.orderItems ?? [];
      const newItems = dto.newOrderItems ?? [];

      const mergedUpdatedItems = mergeOrderItems(existingItems, updatedItems);
      const combinedItems = [...mergedUpdatedItems, ...newItems];

      const { orderItems, productTotalTva, productTotalTtc, productTotalHt } =
        await this.orderCalculationService.calculateOrderItems(combinedItems);

      // Step 2: Delete missing items
      const idsToDelete = findDeletedEntityIds(existingItems, updatedItems);

      if (idsToDelete.length > 0) {
        await itemRepo.delete(idsToDelete);
      }

      return await orderRepo.save({
        id,
        ...dto,
        amountHt: roundMoney(productTotalHt),
        netAmountTtc: roundMoney(productTotalTtc),
        netToPay: roundMoney(productTotalTtc),
        totalTva: roundMoney(productTotalTva),
        orderItems,
      });
    });
  }

  async remove(id: number, user: CurrentUserData) {
    const order = await this.orderRepository.findOneByOrFail({ id, clientId: user.client?.id });
    if (order.statusId !== OrderStatus.NEW) {
      throw new BadRequestException(`Only orders in ${orderStatusesString[OrderStatus.NEW]} status can be deleted`);
    }
    await this.orderRepository.remove(order);
  }
}
