import { Module } from '@nestjs/common';
import { OptionsValuesService } from './options-values.service';
import { OptionsValuesController } from './options-values.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionsValue } from './entities/options-value.entity';
import { OptionsValuesSyncController } from 'src/modules/options-values/options-sync.controller';

@Module({
  controllers: [OptionsValuesController, OptionsValuesSyncController],
  providers: [OptionsValuesService],
  imports: [TypeOrmModule.forFeature([OptionsValue])],
})
export class OptionsValuesModule {}
