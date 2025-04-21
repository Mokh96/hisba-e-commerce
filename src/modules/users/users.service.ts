import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { RoleVisibilityMap } from 'src/common/constants';
import { Roles } from 'src/common/enums/roles.enum';
import { UpdateMeDto } from 'src/modules/users/dto/update-me.dto';
import { FindOptionsWhere, FindOptionsWhereProperty, In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

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

  async findAll(currentRoleId: User['roleId'], roleId?: Roles) {
    const where: FindOptionsWhereProperty<User> = {};

    const visibleRoles = RoleVisibilityMap[currentRoleId] || [];

    if (visibleRoles.length) {
      where.roleId = In(visibleRoles);
    }

    if (roleId) where.roleId = roleId;

    const users = await this.usersRepository.findBy(where);
    return users;
  }

  async findOne(id: User['id']) {
    const user = await this.usersRepository.findOneByOrFail({ id });
    if (!user) {
      throw new NotFoundException(`User '${id}' not found`);
    }
    return user;
  }

  /**
   * Find a user by its username.
   *
   * @param username The username to search for.
   * @returns The user if found, or `null` if not found.
   */
  async findUser(username: User['username']): Promise<Pick<User, 'id' | 'username' | 'password' | 'roleId'>> {
    return await this.usersRepository.findOne({
      select: ['id', 'username', 'password', 'roleId'],
      where: { username },
    });
  }

  async findUserById(id: User['id']) {
    return await this.usersRepository.findOne({
      select: ['id', 'username', 'password', 'roleId'],
      where: { id },
    });
  }

  async findUserWhere(where: FindOptionsWhere<User>) {
    return await this.usersRepository.findOne({
      select: ['id', 'username', 'password', 'roleId'],
      where,
    });
  }

  async update(id: User['id'], updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    const updatedUser = this.usersRepository.merge(user, updateUserDto);

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updatedUser.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    if (user.roleId === Roles.COMPANY) user.isActive = true; //Company users are always active

    await this.usersRepository.save(updatedUser);
    return updatedUser;
  }

  async remove(id: User['id']) {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
    return { success: true };
  }

  async updateMe(id: User['id'], updateMeDto: UpdateMeDto) {
    const { username, oldPassword, newPassword } = updateMeDto;

    if (username) await this.update(id, { username });

    if (oldPassword && newPassword) {
      await this.changePassword(id, oldPassword, newPassword);
    }

    return { success: true };
  }

  async changePassword(userId: User['id'], oldPassword: string, newPassword: string) {
    const user = await this.findUserById(userId);

    //Compare the old password with the password in DB
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    //Change user's password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(newPassword, salt);

    return await this.usersRepository.update({ id: userId }, { password });
  }

  async exist() {
    return await this.usersRepository.exist();
  }
}
