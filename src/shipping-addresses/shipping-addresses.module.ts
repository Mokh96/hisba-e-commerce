import { Module } from '@nestjs/common';
import { ShippingAddressesService } from './shipping-addresses.service';
import { ShippingAddressesController } from './shipping-addresses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingAddress } from './entities/shipping-address.entity';

@Module({
  controllers: [ShippingAddressesController],
  imports: [TypeOrmModule.forFeature([ShippingAddress])],
  providers: [ShippingAddressesService],
})
export class ShippingAddressesModule {}
