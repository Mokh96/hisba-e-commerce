import { Controller, Get, Param } from '@nestjs/common';
import { TownsService } from './towns.service';

@Controller('towns')
export class TownsController {
  constructor(private readonly townsService: TownsService) {}

  @Get()
  findAll() {
    return this.townsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.townsService.findOne(+id);
  }
}
