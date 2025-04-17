import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/modules/users/users.module';
import { ShippingAddressesModule } from '../shipping-addresses/shipping-addresses.module';
import { ClientsSyncController } from './clients-sync.controller';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), UsersModule, ShippingAddressesModule],
  controllers: [ClientsController, ClientsSyncController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
