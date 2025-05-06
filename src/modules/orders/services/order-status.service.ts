import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/modules/orders/entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { CurrentUserData } from 'src/common/decorators';
import { Role } from 'src/common/enums/roles.enum';
import { OrderStatus } from 'src/modules/orders/enums/order-status.enum';
import { OrderHistory } from 'src/modules/order-history/entities/order-history.entity';
import { ChangeStatusDto } from 'src/modules/orders/dto/change-status.dto';
import { changeOrderStatus } from 'src/modules/orders/util/order-workflow.util';

@Injectable()
export class OrderStatusService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private dataSource: DataSource,
  ) {}

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
