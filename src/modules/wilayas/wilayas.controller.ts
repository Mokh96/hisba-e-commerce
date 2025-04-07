import { Controller, Get, Param } from '@nestjs/common';
import { WilayasService } from './wilayas.service';

@Controller('wilayas')
export class WilayasController {
  constructor(private readonly wilayasService: WilayasService) {}

  @Get()
  findAll() {
    return this.wilayasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wilayasService.findOne(+id);
  }
}
