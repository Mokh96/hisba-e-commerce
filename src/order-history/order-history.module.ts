import { Module } from '@nestjs/common';
import { OrderHistoryService } from './order-history.service';
import { OrderHistoryController } from './order-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderHistory } from './entities/order-history.entity';

@Module({
  controllers: [OrderHistoryController],
  providers: [OrderHistoryService],
  imports: [TypeOrmModule.forFeature([OrderHistory])],
})
export class OrderHistoryModule {}
