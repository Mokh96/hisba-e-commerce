import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingAddress } from './entities/shipping-address.entity';
import { ShippingAddressesController } from './shipping-addresses.controller';
import { ShippingAddressesService } from './shipping-addresses.service';

@Module({
  controllers: [ShippingAddressesController],
  imports: [TypeOrmModule.forFeature([ShippingAddress])],
  providers: [ShippingAddressesService],
  exports: [ShippingAddressesService],
})
export class ShippingAddressesModule {}
