import { Body, Controller, Param, ParseIntPipe, Patch, Res, UseInterceptors } from '@nestjs/common';
import { CurrentUser, CurrentUserData, Roles } from 'src/common/decorators';
import { Role } from 'src/common/enums/roles.enum';
import { OrderStatus } from 'src/modules/orders/enums/order-status.enum';
import { OrderStatusService } from 'src/modules/orders/services/order-status.service';
import { ValidateBulkDtoInterceptor } from 'src/common/interceptors/validate-bulk-dto.Interceptor';
import { ChangeStatusDto } from 'src/modules/orders/dto/change-status.dto';
import { getBulkStatus } from 'src/common/utils/bulk-status.util';
import { Response } from 'express';

@Controller('orders')
export class OrderStatusController {
  constructor(private readonly orderStatusService: OrderStatusService) {}

  @Roles(Role.COMPANY, Role.CLIENT)
  @Patch(':id/status/canceled')
  async toCanceled(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: CurrentUserData) {
    return await this.orderStatusService.changeOrderStatus(id, OrderStatus.CANCELED, user);
  }

  @Roles(Role.COMPANY)
  @Patch(':id/status/confirmed')
  async toConfirmed(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: CurrentUserData) {
    return await this.orderStatusService.changeOrderStatus(id, OrderStatus.CONFIRMED, user);
  }

  @Roles(Role.COMPANY)
  @Patch(':id/status/completed')
  async toCompleted(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: CurrentUserData) {
    return await this.orderStatusService.changeOrderStatus(id, OrderStatus.COMPLETED, user);
  }

  //@Roles(Role.COMPANY)
  @Patch('status/bulk')
  @UseInterceptors(new ValidateBulkDtoInterceptor(ChangeStatusDto))
  async BulkChangeStatus(
    @Res() res: Response,
    @Body() changeStatusDtoBulkDto: ChangeStatusDto[],
    @CurrentUser() user: CurrentUserData,
  ) {
    const response = await this.orderStatusService.BulkChangeStatus(changeStatusDtoBulkDto, user);

    const status = getBulkStatus({ failures: response.failures.length, success: response.successes.length });
    return res.status(status).json(response);
  }
}
