import { Controller, Get } from '@nestjs/common';
import { getFilterProductMetadata } from 'src/modules/products/utils/product-filter-metadata.utils';
import { getFilterOrderMetadata } from 'src/modules/orders/utils/order-filter-metadata.utils';
import { getFilterClientMetadata } from 'src/modules/clients/utils/client-filter-metadata.utils';

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

  @Get('orders')
  getOrderFilterMetadata() {
    return getFilterOrderMetadata();
  }

  @Get('clients')
  getClientFilterMetadata() {
    return getFilterClientMetadata();
  }

}
