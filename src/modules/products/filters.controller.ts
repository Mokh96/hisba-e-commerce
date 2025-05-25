import { Controller, Get } from '@nestjs/common';
import { Product } from 'src/modules/products/entities/product.entity';
import { getFilterableFields } from 'src/common/decorators/metadata/filterable.decorator';
import { getFilterProductMetadata } from 'src/modules/products/utils/product-filter-metadata.utils';

@Controller('filters')
export class FiltersController {
 /* @Get('products')
  getProductFilterMetadata() {
    return getFilterableFields(Product);
  }*/

  @Get('products')
  getProductFilterMetadata() {
    return getFilterProductMetadata();
  }
}
