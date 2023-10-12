import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TierTypesService } from './tier-types.service';
import { CreateTierTypeDto } from './dto/create-tier-type.dto';
import { UpdateTierTypeDto } from './dto/update-tier-type.dto';

@Controller('tier-types')
export class TierTypesController {
  constructor(private readonly tierTypesService: TierTypesService) {}

  @Post()
  create(@Body() createTierTypeDto: CreateTierTypeDto) {
    return this.tierTypesService.create(createTierTypeDto);
  }

  @Get()
  findAll() {
    return this.tierTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tierTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTierTypeDto: UpdateTierTypeDto) {
    return this.tierTypesService.update(+id, updateTierTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tierTypesService.remove(+id);
  }
}
