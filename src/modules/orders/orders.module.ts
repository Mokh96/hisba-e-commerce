import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { ClientsModule } from 'src/modules/clients/clients.module';
import { CartItemsModule } from 'src/modules/cart-items/cart-items.module';
import { ArticlesModule } from 'src/modules/articles/articles.module';
import { ProductsModule } from 'src/modules/products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), CartItemsModule, ArticlesModule, ProductsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
