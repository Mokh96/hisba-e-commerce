import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { LotsService } from './lots.service';
import { CreateLotDto } from './dto/create-lot.dto';
import { UpdateLotDto, UpdateSyncLotDto } from './dto/update-lot.dto';
import { CreateSyncLotDto } from './dto/create-lot.dto';
import { QueryLotDto } from './dto/query-lot.dto';

@Controller('lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Post()
  create(@Body() createLotDto: CreateLotDto) {
    return this.lotsService.create(createLotDto as CreateSyncLotDto);
  }

  @Get()
  findAll(@Query() queryLotDto: QueryLotDto) {
    return this.lotsService.findAll(queryLotDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lotsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLotDto: UpdateLotDto,
  ) {
    return this.lotsService.update(+id, updateLotDto as UpdateSyncLotDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lotsService.remove(+id);
  }
}
