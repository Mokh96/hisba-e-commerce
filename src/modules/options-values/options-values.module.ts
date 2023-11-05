import { Module } from '@nestjs/common';
import { OptionsValuesService } from './options-values.service';
import { OptionsValuesController } from './options-values.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionsValue } from './entities/options-value.entity';

@Module({
  controllers: [OptionsValuesController],
  providers: [OptionsValuesService],
  imports: [TypeOrmModule.forFeature([OptionsValue])],
})
export class OptionsValuesModule {}
