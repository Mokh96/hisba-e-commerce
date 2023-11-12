import { Module } from '@nestjs/common';
import { LotsService } from './lots.service';
import { LotsController } from './lots.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lot } from './entities/lot.entity';
import { ProductsModule } from 'src/modules/products/products.module';
import { LotsSyncController } from './lots-sync.controller';
import { ArticlesModule } from '../articles/articles.module';
import { QueryHelper } from 'src/helpers/query.helper';

@Module({
  controllers: [LotsSyncController, LotsController],
  providers: [LotsService, ArticlesModule, QueryHelper],
  imports: [TypeOrmModule.forFeature([Lot]), ProductsModule],
})
export class LotsModule {}
