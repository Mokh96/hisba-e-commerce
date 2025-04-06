import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { UpdateClientMeDto } from 'src/modules/clients/dto/update-me.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UsersService } from 'src/modules/users/users.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService, private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.findOne(+id);
  }

  @Patch('me')
  async updateMe(@Body() updateClientDto: UpdateClientMeDto, @CurrentUser('sub') id: number) {
    const { user } = updateClientDto;
    return await this.usersService.updateMe(id, user);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(+id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.remove(+id);
  }
}
