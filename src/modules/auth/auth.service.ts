import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums/roles.enum';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';
import { CurrentUserData } from 'src/common/decorators';
import { ClientsService } from 'src/modules/clients/clients.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private clientService: ClientsService,
  ) {}

  async logIn(authDto: AuthDto) {
    const { username, password } = authDto;
    const user = await this.usersService.findUser(username);

    if (!user) {
      throw new NotFoundException(`User '${username}' not found`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { id, roleId } = user;

    const payload: CurrentUserData = {
      username,
      sub: id,
      roleId,
    };

    if (roleId === Role.CLIENT) {
      const clientId = await this.clientService.getClientIdByUserId(user.id);
      payload.client = {
        id: clientId,
      };
    }

    return {
      token: await this.jwtService.signAsync(payload),
    };
  }

  async logInCompany(authDto: AuthDto) {
    const { username, password } = authDto;
    const company = await this.usersService.findUserWhere({ username, roleId: Role.COMPANY });

    if (!company) {
      throw new NotFoundException(`Company '${username}' not found`);
    }
    const isPasswordValid = await bcrypt.compare(password, company.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { id, roleId } = company;

    const payload = {
      username,
      sub: id,
      roleId,
    };

    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
