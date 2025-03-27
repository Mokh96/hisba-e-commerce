import { Module } from '@nestjs/common';
import { WilayasService } from './wilayas.service';
import { WilayasController } from './wilayas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wilaya } from 'src/modules/wilayas/entities/wilaya.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wilaya])],
  controllers: [WilayasController],
  providers: [WilayasService],
})
export class WilayasModule {}
