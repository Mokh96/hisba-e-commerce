import { Module } from '@nestjs/common';
import { LotsService } from './lots.service';
import { LotsController } from './lots.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lot } from './entities/lot.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
  controllers: [LotsController],
  providers: [LotsService],
  imports: [TypeOrmModule.forFeature([Lot]), ProductsModule],
})
export class LotsModule {}
