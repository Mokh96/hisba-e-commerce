import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhereProperty, Repository } from 'typeorm';
import { Roles } from 'src/enums/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto & { roleId: Roles }) {
    const user = new User();

    Object.assign(user, createUserDto);

    return await this.usersRepository.save(user);
  }

  async findAll(roleId?: Roles) {
    const where: FindOptionsWhereProperty<User> = {};

    if (roleId) where.roleId = roleId;

    const users = await this.usersRepository.findBy(where);
    return users;
  }

  async findOne(id: User['id']) {
    const user = await this.usersRepository.findOneByOrFail({ id });
    return user;
  }

  /**
   * Find a user by its username.
   *
   * @param username The username to search for.
   * @returns The user if found, or `null` if not found.
   */
  async findUser(username: User['username']) {
    const user = await this.usersRepository.findOne({
      select: ['id', 'username', 'password', 'roleId'],
      where: { username },
    });
    return user;
  }

  async update(id: User['id'], updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    const updatedUser = this.usersRepository.merge(user, updateUserDto);
    await this.usersRepository.save(updatedUser);
    return updatedUser;
  }

  async remove(id: User['id']) {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
    return true;
  }
}
