import { Module } from '@nestjs/common';
import { DelegatesService } from './delegates.service';
import { DelegatesController } from './delegates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delegate } from './entities/delegate.entity';

@Module({
  controllers: [DelegatesController],
  imports: [TypeOrmModule.forFeature([Delegate])],

  providers: [DelegatesService],
})
export class DelegatesModule {}
