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
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('tiers')
export class ClientsController {
  constructor(private readonly tiersService: ClientsService) {}

  @Post()
  create(@Body() createTierDto: CreateClientDto) {
    return this.tiersService.create(createTierDto, { id: 1 });
  }

  @Get()
  findAll() {
    return this.tiersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tiersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTierDto: UpdateClientDto,
  ) {
    return this.tiersService.update(+id, updateTierDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tiersService.remove(+id);
  }
}
