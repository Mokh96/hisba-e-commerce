import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums/roles.enum';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';
import { CurrentUserData } from 'src/common/decorators';
import { ClientsService } from 'src/modules/clients/clients.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/modules/clients/entities/client.entity';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/startup/i18n/generated/i18n.generated';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private clientService: ClientsService,
    private readonly i18n: I18nService<I18nTranslations>
  ) {}

  async logIn(authDto: AuthDto) {
    const { username, password } = authDto;
    const user = await this.usersService.findUser(username);

    if (!user) {
      throw new NotFoundException(`User '${username}' not found`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(this.i18n.translate('auth.invalidPassword'));
    }

    const payload: CurrentUserData = {
      username,
      sub: user.id,
      roleId: user.roleId,
    };

    if (user.roleId === Role.CLIENT) {
      const clientId = await this.clientService.getClientIdByUserId(user.id);
      payload.client = {
        id: clientId,
      };
    }

    delete user.password;

    return {
      token: await this.jwtService.signAsync(payload),
      user,
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
      throw new UnauthorizedException(this.i18n.translate('auth.invalidCredentials'));
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

  async getUserDetails(user: CurrentUserData) {
    const existUser = await this.usersService.findOne(user.sub);
    const toClient = {
      ...existUser,
    };

    if (existUser.roleId === Role.CLIENT) {
      toClient['client'] = await this.clientRepository.findOneOrFail({
        where: { id: user.client.id },
        relations: { shippingAddresses: true },
      });
    }

    return {
      ...toClient,
    };
  }
}
