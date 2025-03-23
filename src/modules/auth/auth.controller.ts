import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

import { Public } from '../../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post()
  async logIn(@Body() authDto: AuthDto) {
    return await this.authService.logIn(authDto);
  }
}
