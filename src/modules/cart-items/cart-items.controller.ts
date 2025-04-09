import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CurrentUser, Role } from 'src/common/decorators';
import { Roles } from 'src/enums/roles.enum';
import { User } from 'src/modules/users/entities/user.entity';

@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Post()
  @Role(Roles.CLIENT)
  create(@Body() createCartItemDto: CreateCartItemDto, @CurrentUser('sub') userId: User['id']) {
    return this.cartItemsService.create(createCartItemDto, userId);
  }

  @Get()
  @Role(Roles.CLIENT)
  findAll(@CurrentUser('sub') userId: User['id']) {
    return this.cartItemsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser('sub') userId: User['id']) {
    return this.cartItemsService.findOne(id, userId);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCartItemDto: UpdateCartItemDto) {
    return this.cartItemsService.update(+id, updateCartItemDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cartItemsService.remove(+id);
  }
}
