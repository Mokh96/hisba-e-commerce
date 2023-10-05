import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProspectiveTiersService } from './prospective-tiers.service';
import { CreateProspectiveTierDto } from './dto/create-prospective-tier.dto';
import { UpdateProspectiveTierDto } from './dto/update-prospective-tier.dto';

@Controller('prospective-tiers')
export class ProspectiveTiersController {
  constructor(private readonly prospectiveTiersService: ProspectiveTiersService) {}

  @Post()
  create(@Body() createProspectiveTierDto: CreateProspectiveTierDto) {
    return this.prospectiveTiersService.create(createProspectiveTierDto);
  }

  @Get()
  findAll() {
    return this.prospectiveTiersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prospectiveTiersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProspectiveTierDto: UpdateProspectiveTierDto) {
    return this.prospectiveTiersService.update(+id, updateProspectiveTierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prospectiveTiersService.remove(+id);
  }
}
