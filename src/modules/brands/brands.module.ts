import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { SyncBrandController } from './brand-sync.controller';

@Module({
  controllers: [SyncBrandController, BrandsController],
  providers: [BrandsService],
  imports: [TypeOrmModule.forFeature([Brand])],
})
export class BrandsModule {}
