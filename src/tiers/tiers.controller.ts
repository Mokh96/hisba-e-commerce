import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TiersService } from './tiers.service';
import { CreateTierDto } from './dto/create-tier.dto';
import { UpdateTierDto } from './dto/update-tier.dto';

@Controller('tiers')
export class TiersController {
  constructor(private readonly tiersService: TiersService) {}

  @Post()
  create(@Body() createTierDto: CreateTierDto) {
    return this.tiersService.create(createTierDto);
  }

  @Get()
  findAll() {
    return this.tiersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTierDto: UpdateTierDto) {
    return this.tiersService.update(+id, updateTierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tiersService.remove(+id);
  }
}
