import { Module } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { FamiliesController } from './families.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Family } from './entities/family.entity';
import { SyncFamilyController } from './families-sync.controller';

@Module({
  controllers: [SyncFamilyController, FamiliesController],
  providers: [FamiliesService],
  imports: [TypeOrmModule.forFeature([Family])],
})
export class FamiliesModule {}
