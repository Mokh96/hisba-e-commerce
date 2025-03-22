import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
