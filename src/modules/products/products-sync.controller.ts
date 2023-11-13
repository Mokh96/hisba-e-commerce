import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  ParseArrayPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateSyncProductDto } from './dto/create-product.dto';
import {
  UpdateProductDto,
  UpdateSyncProductDto,
} from './dto/update-product.dto';
import { validateBulk } from 'src/helpers/validation/validation';

@Controller('products/sync')
export class ProductsSyncController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createSyncProductDto: CreateSyncProductDto) {
    return this.productsService.create(createSyncProductDto);
  }

  @Post('bulk')
  async createBulk(@Body(ParseArrayPipe) createSyncProductDtoArray) {
    const { valSuccess, valFailures } = await validateBulk(
      createSyncProductDtoArray,
      CreateSyncProductDto,
    );

    const { success, baseFailures } = await this.productsService.createBulk(
      valSuccess,
    );

    return { success, valFailures, baseFailures };
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSyncProductDto: UpdateSyncProductDto,
  ) {
    return this.productsService.update(+id, updateSyncProductDto);
  }
}
