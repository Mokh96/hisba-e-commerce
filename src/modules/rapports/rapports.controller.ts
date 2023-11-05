import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { RapportsService } from './rapports.service';
import { CreateRapportDto } from './dto/create-rapport.dto';
import { UpdateRapportDto } from './dto/update-rapport.dto';

@Controller('rapports')
export class RapportsController {
  constructor(private readonly rapportsService: RapportsService) {}

  @Post()
  create(@Body() createRapportDto: CreateRapportDto) {
    return this.rapportsService.create(createRapportDto);
  }

  @Get()
  findAll() {
    return this.rapportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rapportsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRapportDto: UpdateRapportDto,
  ) {
    return this.rapportsService.update(+id, updateRapportDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rapportsService.remove(+id);
  }
}
