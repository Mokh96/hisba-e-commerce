import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/common/enums/roles.enum';
import { RoleHierarchyGuard } from 'src/common/guards';
import { UpdateMeDto } from 'src/modules/users/dto/update-me.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('test')
  async test() {
    throw new ForbiddenException('Target user not found');
    return this.usersService.test();
  }

  @Post()
  @Role(Roles.SUPERADMIN, Roles.ADMIN)
  async create(@Body() createUserDto: CreateUserDto, @CurrentUser('roleId') currentRole: User['roleId']) {
    const roleId = createUserDto.roleId || Roles.CLIENT;

    if (roleId <= Roles.ADMIN && currentRole !== Roles.SUPERADMIN) {
      throw new ForbiddenException('You do not have permission to create this user');
    }

    const user = await this.usersService.create({ ...createUserDto, roleId });
    delete user.password;
    return user;
  }

  @Get()
  findAll(@CurrentUser('roleId') currentRole: User['roleId'], @Query('roleId') roleId?: number) {
    return this.usersService.findAll(currentRole, roleId);
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
  @Role(Roles.SUPERADMIN, Roles.ADMIN)
  @UseGuards(RoleHierarchyGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(RoleHierarchyGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(+id);
  }
}
