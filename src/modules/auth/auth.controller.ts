import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

import { Public } from 'src/common/decorators/public.decorator';
import { CurrentUser, CurrentUserData } from 'src/common/decorators';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  async logIn(@Body() authDto: AuthDto) {
    return await this.authService.logIn(authDto);
  }

  @Public()
  @Post('company')
  @HttpCode(HttpStatus.OK)
  async logInCompany(@Body() authDto: AuthDto) {
    return await this.authService.logInCompany(authDto);
  }

  @Get('/me')
  async getUserDetails(@CurrentUser() user: CurrentUserData) {
    return await this.authService.getUserDetails(user);
  }
}
