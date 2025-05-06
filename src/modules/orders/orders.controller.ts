import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CurrentUser, CurrentUserData, Roles } from 'src/common/decorators';
import { Role } from 'src/common/enums/roles.enum';
import { PaginationDto } from 'src/common/dtos/filters/pagination-query.dto';
import { OrderFilterDto } from 'src/modules/orders/dto/order-filter.dto';
import { OrderStatus } from 'src/modules/orders/enums/order-status.enum';
import { ChangeStatusDto } from 'src/modules/orders/dto/change-status.dto';
import { getBulkStatus } from 'src/common/utils/bulk-status.util';
import { Response } from 'express';
import { ValidateBulkDtoInterceptor } from 'src/common/interceptors/validate-bulk-dto.Interceptor';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(Role.CLIENT)
  create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: CurrentUserData) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto, @Query() filterDto: OrderFilterDto) {
    return this.ordersService.findAll(paginationDto, filterDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }

  @Roles(Role.COMPANY, Role.CLIENT)
  @Patch(':id/status/canceled')
  async toCanceled(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: CurrentUserData) {
    return await this.ordersService.changeOrderStatus(id, OrderStatus.CANCELED, user);
  }

  @Roles(Role.COMPANY)
  @Patch(':id/status/confirmed')
  async toConfirmed(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: CurrentUserData) {
    return await this.ordersService.changeOrderStatus(id, OrderStatus.CONFIRMED, user);
  }

  @Roles(Role.COMPANY)
  @Patch(':id/status/completed')
  async toCompleted(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: CurrentUserData) {
    return await this.ordersService.changeOrderStatus(id, OrderStatus.COMPLETED, user);
  }

  //@Roles(Role.COMPANY)
  @Patch('status/bulk')
  @UseInterceptors(new ValidateBulkDtoInterceptor(ChangeStatusDto))
  async BulkChangeStatus(
    @Res() res: Response,
    @Body() changeStatusDtoBulkDto: ChangeStatusDto[],
    @CurrentUser() user: CurrentUserData,
  ) {
    const response = await this.ordersService.BulkChangeStatus(changeStatusDtoBulkDto, user);

    const status = getBulkStatus({ failures: response.failures.length, success: response.successes.length });
    return res.status(status).json(response);
  }
}
