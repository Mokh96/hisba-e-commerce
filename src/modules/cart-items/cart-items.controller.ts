import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CurrentUser, CurrentUserData, Roles } from 'src/common/decorators';
import { Role } from 'src/common/enums/roles.enum';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { Product } from 'src/modules/products/entities/product.entity';

@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Post()
  @Roles(Role.CLIENT)
  create(@Body() createCartItemDto: CreateCartItemDto, @CurrentUser() activeUserData: CurrentUserData) {
    return this.cartItemsService.create(createCartItemDto, activeUserData);
  }

  @Get()
  @Roles(Role.CLIENT)
  findAll(@CurrentUser() activeUserData: CurrentUserData): Promise<PaginatedResult> {
    return this.cartItemsService.findAll(activeUserData);
  }

  @Get(':id')
  @Roles(Role.CLIENT)
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() activeUserData: CurrentUserData) {
    return this.cartItemsService.findOne(id, activeUserData);
  }

  @Patch(':id')
  @Roles(Role.CLIENT)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCartItemDto: UpdateCartItemDto) {
    return this.cartItemsService.update(+id, updateCartItemDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cartItemsService.remove(id);
  }
}
