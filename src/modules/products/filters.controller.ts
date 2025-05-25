import { Controller, Get } from '@nestjs/common';
import { Product } from 'src/modules/products/entities/product.entity';
import { getFilterableFields } from 'src/common/decorators/metadata/filterable.decorator';
import { getFilterMap } from 'src/modules/products/dto/product-filter.dto';

@Controller('filters')
export class FiltersController {
 /* @Get('products')
  getProductFilterMetadata() {
    return getFilterableFields(Product);
  }*/

  @Get('products')
  getProductFilterMetadata() {
    return getFilterMap();
  }
}
