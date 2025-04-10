import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Article } from 'src/modules/articles/entities/article.entity';
import { PaymentMethod } from 'src/modules/payment-methods/entities/payment-method.entity';
import { ClientsModule } from 'src/modules/clients/clients.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Article, PaymentMethod]), ClientsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
