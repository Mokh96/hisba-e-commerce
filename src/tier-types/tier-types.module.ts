import { Module } from '@nestjs/common';
import { TierTypesService } from './tier-types.service';
import { TierTypesController } from './tier-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TierType } from './entities/tier-type.entity';

@Module({
  controllers: [TierTypesController],
  imports: [TypeOrmModule.forFeature([TierType])],

  providers: [TierTypesService],
})
export class TierTypesModule {}
