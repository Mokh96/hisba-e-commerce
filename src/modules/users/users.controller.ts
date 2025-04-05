import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/enums/roles.enum';
import { SetRoles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateMeDto } from 'src/modules/users/dto/update-me.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create({ ...createUserDto, roleId: Roles.CLIENT });
    delete user.password;
    return user;
  }

  @Get()
  findAll(@Query('roleId') roleId?: number) {
    return this.usersService.findAll(roleId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(+id);
  }

  @Patch('me')
  async updateMe(@Body() updateUserDto: UpdateMeDto, @CurrentUser('sub') id: number) {
    return this.usersService.updateMe(id, updateUserDto);
  }

  @Patch(':id')
  @SetRoles(Roles.SUPERADMIN, Roles.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(+id);
  }
}
