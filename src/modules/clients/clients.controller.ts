import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { Role } from 'src/common/decorators';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/enums/roles.enum';
import { UpdateClientMeDto } from 'src/modules/clients/dto/update-me.dto';
import { UsersService } from 'src/modules/users/users.service';
import { ClientsService } from './clients.service';
import { ClientFilterDto } from './dto/client-filter.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { BasePaginationDto } from 'src/common/dtos/base-pagination.dto';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService, private readonly usersService: UsersService) {}

  @Post()
  @Role(Roles.ADMIN, Roles.SUPERADMIN, Roles.COMPANY)
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  findMany(@Query() filterDto: ClientFilterDto, @Query() paginationDto: BasePaginationDto): Promise<PaginatedResult> {
    return this.clientsService.findMany(filterDto, paginationDto);
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
  @Role(Roles.ADMIN, Roles.SUPERADMIN, Roles.COMPANY)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(+id, updateClientDto);
  }

  @Delete(':id')
  @Role(Roles.ADMIN, Roles.SUPERADMIN, Roles.COMPANY)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.remove(+id);
  }
}
