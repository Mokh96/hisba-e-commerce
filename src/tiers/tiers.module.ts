import { Module } from '@nestjs/common';
import { TiersService } from './tiers.service';
import { TiersController } from './tiers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tier } from './entities/tier.entity';

@Module({
  controllers: [TiersController],
  imports: [TypeOrmModule.forFeature([Tier])],

  providers: [TiersService],
})
export class TiersModule {}
