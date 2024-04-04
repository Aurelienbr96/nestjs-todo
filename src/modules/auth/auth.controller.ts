import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { v4 as uuid } from 'uuid';

import { UserService } from '../user';

import { UserToRegisterDTO } from './dto/user-to-register.dto';
import { PublicUserModel, UserModel } from './type';
import { Auth } from './decorators';
import { UserToLoginDTO } from './dto/user-to-login.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private user: UserService, private auth: AuthService) {}

  @ApiCreatedResponse({ description: 'Account created', type: PublicUserModel })
  @Post('/register')
  async register(@Body() userToRegister: UserToRegisterDTO) {
    const { password, ...user } = await this.user.create(userToRegister);
    return user;
  }

  @Post('/login')
  @UseGuards(PassportAuthGuard('local'))
  @ApiCreatedResponse({
    description: 'Successful login',
    type: PublicUserModel,
  })
  async login(@Res({ passthrough: true }) res: Response, @Auth() auth: UserModel, @Body() _userToLogin: UserToLoginDTO) {
    const { password, refresh, ...user } = auth;

    const accessToken = this.auth.signAccessToken(auth.id, auth.email, auth.role);

    const refreshToken = this.auth.signRefreshToken(auth.id, uuid());

    this.auth.setCookie(res, 'access-token', accessToken, this.auth.getAccessTokenExpires());
    this.auth.setCookie(res, 'refresh-token', refreshToken, this.auth.getRefreshTokenExpires());

    return user;
  }

  @Post('/refresh-token')
  @UseGuards(PassportAuthGuard('refresh-jwt'))
  @ApiUnauthorizedResponse({ description: 'invalid refresh token' })
  @ApiCreatedResponse({
    description: 'successful refresh token',
    type: PublicUserModel,
  })
  async refreshToken(@Res({ passthrough: true }) res: Response, @Auth() auth: UserModel) {
    const { password, refresh, ...user } = auth;
    const accessToken = this.auth.signAccessToken(user.id, user.email, user.role);

    const refreshToken = this.auth.signRefreshToken(user.id, refresh);

    this.auth.setCookie(res, 'access-token', accessToken, this.auth.getAccessTokenExpires());
    this.auth.setCookie(res, 'refresh-token', refreshToken, this.auth.getRefreshTokenExpires());
    return user;
  }
}
