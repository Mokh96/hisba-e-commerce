import { Module } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CartItemsController } from './cart-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';

@Module({
  controllers: [CartItemsController],
  providers: [CartItemsService],
  imports: [TypeOrmModule.forFeature([CartItem])],
})
export class CartItemsModule {}
