import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

import { Public } from 'src/common/decorators/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async logIn(@Body() authDto: AuthDto) {
    return await this.authService.logIn(authDto);
  }

  @Post('company')
  async logInCompany(@Body() authDto: AuthDto) {
    return await this.authService.logInCompany(authDto);
  }
}
