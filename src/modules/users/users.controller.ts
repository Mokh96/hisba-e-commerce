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
import { RoleHierarchyGuard } from 'src/common/guards';
import { UpdateMeDto } from 'src/modules/users/dto/update-me.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { Role } from 'src/common/enums/roles.enum';
import { Roles } from 'src/common/decorators';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('test')
  async test() {
    // throw new ForbiddenException('You do not have permission to create this user');
    return this.usersService.test();
  }

  @Post()
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async create(@Body() createUserDto: CreateUserDto, @CurrentUser('roleId') currentRole: User['roleId']) {
    const roleId = createUserDto.roleId || Role.CLIENT;

    if (roleId <= Role.ADMIN && currentRole !== Role.SUPERADMIN) {
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
  @Roles(Role.SUPERADMIN, Role.ADMIN)
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
