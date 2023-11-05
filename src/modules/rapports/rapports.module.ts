import { Module } from '@nestjs/common';
import { RapportsService } from './rapports.service';
import { RapportsController } from './rapports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rapport } from './entities/rapport.entity';

@Module({
  controllers: [RapportsController],
  imports: [TypeOrmModule.forFeature([Rapport])],

  providers: [RapportsService],
})
export class RapportsModule {}
