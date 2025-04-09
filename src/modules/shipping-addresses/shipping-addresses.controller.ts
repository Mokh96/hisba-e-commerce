import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateShippingAddressDto } from './dto/create-shipping-address.dto';
import { UpdateShippingAddressDto } from './dto/update-shipping-address.dto';
import { ShippingAddressesService } from './shipping-addresses.service';

@Controller('shipping-addresses')
export class ShippingAddressesController {
  constructor(private readonly shippingAddressesService: ShippingAddressesService) {}

  @Post()
  create(@Body() createShippingAddressDto: CreateShippingAddressDto) {
    return this.shippingAddressesService.create(createShippingAddressDto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateShippingAddressDto: UpdateShippingAddressDto) {
    return this.shippingAddressesService.update(+id, updateShippingAddressDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.shippingAddressesService.remove(+id);
  }
}
