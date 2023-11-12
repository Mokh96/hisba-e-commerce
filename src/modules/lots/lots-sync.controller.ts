import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  ParseArrayPipe,
} from '@nestjs/common';
import { LotsService } from './lots.service';
import { UpdateLotDto, UpdateSyncLotDto } from './dto/update-lot.dto';
import { CreateSyncLotDto } from './dto/create-lot.dto';
import { validateBulk } from 'src/helpers/validation/validation';

@Controller('lots/sync')
export class LotsSyncController {
  constructor(private readonly lotsService: LotsService) {}

  @Post()
  create(@Body() createSyncLotDto: CreateSyncLotDto) {
    return this.lotsService.create(createSyncLotDto);
  }

  @Post('/bulk')
  async createBulk(@Body(ParseArrayPipe) createSyncLotDtoArray) {
    const { valSuccess, valFailures } = await validateBulk(
      createSyncLotDtoArray,
      CreateSyncLotDto,
    );

    const { success, baseFailures } = await this.lotsService.createBulk(
      valSuccess,
    );

    return { success, valFailures, baseFailures };
  }

  //TODO : create sync update lot dto
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLotDto: UpdateSyncLotDto,
  ) {
    return this.lotsService.update(+id, updateLotDto);
  }
}
