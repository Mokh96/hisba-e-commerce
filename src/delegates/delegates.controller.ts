import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DelegatesService } from './delegates.service';
import { CreateDelegateDto } from './dto/create-delegate.dto';
import { UpdateDelegateDto } from './dto/update-delegate.dto';

@Controller('delegates')
export class DelegatesController {
  constructor(private readonly delegatesService: DelegatesService) {}

  @Post()
  create(@Body() createDelegateDto: CreateDelegateDto) {
    return this.delegatesService.create(createDelegateDto);
  }

  @Get()
  findAll() {
    return this.delegatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.delegatesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDelegateDto: UpdateDelegateDto) {
    return this.delegatesService.update(+id, updateDelegateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.delegatesService.remove(+id);
  }
}
