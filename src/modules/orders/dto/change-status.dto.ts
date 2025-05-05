import { IsIn, IsNotEmpty, IsPositive } from 'class-validator';
import { OrderStatus } from 'src/modules/orders/enums/order-status.enum';

export class ChangeStatusDto {
  @IsNotEmpty()
  @IsPositive()
  orderId: number;

  @IsNotEmpty()
  @IsIn(Object.values(OrderStatus))
  newStatusId: OrderStatus;
}
