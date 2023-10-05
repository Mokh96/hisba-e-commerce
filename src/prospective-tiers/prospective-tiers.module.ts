import { Module } from '@nestjs/common';
import { ProspectiveTiersService } from './prospective-tiers.service';
import { ProspectiveTiersController } from './prospective-tiers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProspectiveTier } from './entities/prospective-tier.entity';

@Module({
  controllers: [ProspectiveTiersController],
  providers: [ProspectiveTiersService],
  imports: [TypeOrmModule.forFeature([ProspectiveTier])],
})
export class ProspectiveTiersModule {}
