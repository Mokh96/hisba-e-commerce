import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(authDto: AuthDto) {
    const user = await this.userRepository.findOne({
      select: ['id', 'username', 'password', 'roleId'],
      where: { username: authDto.username },
    });
    // console.log(user);

    if (!user) throw new NotFoundException('User not found');
    console.log(authDto.password, user.password);

    const isMatch = await bcrypt.compare(authDto.password, user.password);
    console.log('isMatch', isMatch);

    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      username: user.username,
      sub: user.id,
      roleId: user.roleId,
    };

    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
