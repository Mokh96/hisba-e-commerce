import { Module } from '@nestjs/common';
import { TownsService } from './towns.service';
import { TownsController } from './towns.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Town } from 'src/modules/towns/entities/town.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Town])],
  controllers: [TownsController],
  providers: [TownsService],
})
export class TownsModule {}
