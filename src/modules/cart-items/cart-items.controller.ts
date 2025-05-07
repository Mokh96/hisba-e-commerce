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
  Res,
} from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CurrentUser, CurrentUserData, Roles } from 'src/common/decorators';
import { Role } from 'src/common/enums/roles.enum';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { IdCommonDto } from 'src/common/dtos/id.common.dto';
import { Response } from 'express';
import { getBulkStatus } from 'src/common/utils/bulk-status.util';

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

  @Delete('bulk-remove')
  async removeMany(@Res() res: Response, @Body() ids: IdCommonDto[], @CurrentUser() user: CurrentUserData) {
    const response = await this.cartItemsService.removeMany(ids, user);
    const status = getBulkStatus({ failures: response.failures.length, success: response.successes.length });
    return res.status(status).json(response);
  }


  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: CurrentUserData) {
    return this.cartItemsService.remove(id, user);
  }


}
