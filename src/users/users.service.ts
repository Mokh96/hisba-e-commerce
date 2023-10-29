import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { roles } from 'src/enums/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);

    await this.usersRepository.save(user);
    return user;
  }

  async findAll() {
    const users = await this.usersRepository.findBy({ roleId: roles.ADMIN });
    return users;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    //if (!user) throw new HttpException('etstatus not found', 400);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    let user = await this.findOne(id);
    const updatedUser = this.usersRepository.merge(user, updateUserDto);
    await this.usersRepository.save(updatedUser);
    return updatedUser;
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
    return true;
  }
}
