import { Module } from '@nestjs/common';
import { OrdersService } from './services/orders.service';
import { OrdersController } from './controllers/orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { ClientsModule } from 'src/modules/clients/clients.module';
import { CartItemsModule } from 'src/modules/cart-items/cart-items.module';
import { ArticlesModule } from 'src/modules/articles/articles.module';
import { ProductsModule } from 'src/modules/products/products.module';
import { OrderItemsModule } from 'src/modules/order-items/order-items.module';
import { OrderItem } from 'src/modules/order-items/entities/order-item.entity';
import { OrderStatusController } from 'src/modules/orders/controllers/order-status.controller';
import { OrderStatusService } from 'src/modules/orders/services/order-status.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), CartItemsModule, ArticlesModule, ProductsModule],
  controllers: [OrdersController, OrderStatusController],
  providers: [OrdersService , OrderStatusService],
})
export class OrdersModule {}
