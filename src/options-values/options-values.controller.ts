import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OptionsValuesService } from './options-values.service';
import { CreateOptionsValueDto } from './dto/create-options-value.dto';
import { UpdateOptionsValueDto } from './dto/update-options-value.dto';

@Controller('options-values')
export class OptionsValuesController {
  constructor(private readonly optionsValuesService: OptionsValuesService) {}

  @Post()
  create(@Body() createOptionsValueDto: CreateOptionsValueDto) {
    return this.optionsValuesService.create(createOptionsValueDto);
  }

  @Get()
  findAll() {
    return this.optionsValuesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.optionsValuesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOptionsValueDto: UpdateOptionsValueDto) {
    return this.optionsValuesService.update(+id, updateOptionsValueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.optionsValuesService.remove(+id);
  }
}
