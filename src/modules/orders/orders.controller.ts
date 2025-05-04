import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CurrentUser, CurrentUserData, Roles } from 'src/common/decorators';
import { Role } from 'src/common/enums/roles.enum';
import { User } from 'src/modules/users/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/filters/pagination-query.dto';
import { ProductFilterDto } from 'src/modules/products/dto/product-filter.dto';
import { OrderFilterDto } from 'src/modules/orders/dto/order-filter.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(Role.CLIENT)
  create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: CurrentUserData) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: OrderFilterDto,
  ) {
    return this.ordersService.findAll(paginationDto, filterDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(+id);
  }
}
