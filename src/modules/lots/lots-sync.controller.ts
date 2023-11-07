import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { LotsService } from './lots.service';
import { UpdateLotDto } from './dto/update-lot.dto';
import { CreateSyncLotDto } from './dto/create-lot.dto';

@Controller('lots/sync')
export class LotsSyncController {
  constructor(private readonly lotsService: LotsService) {}

  @Post()
  create(@Body() createSyncLotDto: CreateSyncLotDto) {
    return this.lotsService.create(createSyncLotDto);
  }

  @Post('/bulk')
  createBulk(@Body() createSyncLotDtoArray: CreateSyncLotDto[]) {
    return this.lotsService.createBulk(createSyncLotDtoArray);
  }

  //TODO : create sync update lot dto
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLotDto: UpdateLotDto,
  ) {
    return this.lotsService.update(+id, updateLotDto);
  }
}
