import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateShippingAddressDto } from './dto/create-shipping-address.dto';
import { UpdateShippingAddressDto } from './dto/update-shipping-address.dto';
import { ShippingAddressesService } from './shipping-addresses.service';
import { CurrentUser, CurrentUserData, Roles } from 'src/common/decorators';
import { Role } from 'src/common/enums/roles.enum';

@Controller('shipping-addresses')
export class ShippingAddressesController {
  constructor(private readonly shippingAddressesService: ShippingAddressesService) {}

  @Post()
  @Roles(Role.CLIENT)
  create(@Body() createShippingAddressDto: CreateShippingAddressDto, @CurrentUser() user: CurrentUserData) {
    return this.shippingAddressesService.create(createShippingAddressDto, user);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateShippingAddressDto: UpdateShippingAddressDto) {
    return this.shippingAddressesService.update(id, updateShippingAddressDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.shippingAddressesService.remove(id);
  }
}
