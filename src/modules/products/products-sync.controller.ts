import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateSyncProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products/sync')
export class ProductsSyncController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createSyncProductDto: CreateSyncProductDto) {
    return this.productsService.create(createSyncProductDto);
  }

  @Post('bulk')
  createBulk(@Body() createSyncProductDtoArray: CreateSyncProductDto[]) {
    return this.productsService.createBulk(createSyncProductDtoArray);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(+id, updateProductDto);
  }
}
