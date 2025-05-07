import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { CurrentUser, CurrentUserData, Roles } from 'src/common/decorators';
import { Role } from 'src/common/enums/roles.enum';
import { PaginationDto } from 'src/common/dtos/filters/pagination-query.dto';
import { OrderFilterDto } from 'src/modules/orders/dto/order-filter.dto';
import { OrderStatus } from 'src/modules/orders/enums/order-status.enum';
import { ChangeStatusDto } from 'src/modules/orders/dto/change-status.dto';
import { getBulkStatus } from 'src/common/utils/bulk-status.util';
import { Response } from 'express';
import { ValidateBulkDtoInterceptor } from 'src/common/interceptors/validate-bulk-dto.Interceptor';
import { UpdateOrderByClientDto } from 'src/modules/orders/dto/update-order-by-client.dto';

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
    return this.ordersService.findOne(id);
  }

  //@Roles(Role.COMPANY)
  @Patch(':id')
  updateOrderByCompany(@Param('id', ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.updateOrderByCompany(id, updateOrderDto);
  }

  @Roles(Role.CLIENT)
  @Patch(':id/client')
  updateOrderByClient(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderByClientDto: UpdateOrderByClientDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.ordersService.updateOrderByClient(id, updateOrderByClientDto, user);
  }

  @Roles(Role.CLIENT)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  removeByClient(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: CurrentUserData) {
    return this.ordersService.remove(id , user);
  }
}
