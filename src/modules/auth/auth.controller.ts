import { BadRequestException, Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard, AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';
import { v4 as uuid } from 'uuid';

import { UserService } from '../user';
import { Config, ConfigService } from '../common';

import { UserToRegisterDTO } from './dto/user-to-register.dto';
import { PublicUserModel, UserModel } from './type';
import { Auth } from './decorators';
import { UserToLoginDTO } from './dto/user-to-login.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private googleClient;
  constructor(private user: UserService, private auth: AuthService, private config: ConfigService) {
    this.googleClient = new OAuth2Client(config.get(Config.GoogleClientId));
  }

  //  @UseGuards(AuthGuard('google'))
  @Post('/google')
  async googleAuth(@Body() params: any, @Res({ passthrough: true }) res: Response) {
    const ticket = await this.googleClient.verifyIdToken({
      idToken: params.credential,
      audience: this.config.get(Config.GoogleClientId),
    });
    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error('Invalid token');
    }

    const { sub, email } = payload;

    if (!email || !sub) {
      throw new Error('Error retrieving email');
    }
    let user = await this.user.findByEmail(email);

    if (!user) {
      user = await this.user.createFromGoogle({
        googleId: sub, // Google's unique ID for the user
        email,
      });
    } else {
      user = await this.user.updateRefreshToken(user.id, uuid());
    }
    this.createSignInCookies(user as UserModel, res);

    return user;
  }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Res({ passthrough: true }) res: Response, @Req() req: any, @Auth() auth: UserModel) {
    this.createSignInCookies(auth, res);

    return { message: 'Authentication successful', user: req.user };
  }

  @ApiCreatedResponse({ description: 'Account created', type: PublicUserModel })
  @Post('/register')
  async register(@Body() userToRegister: UserToRegisterDTO) {
    try {
      const { password, ...user } = await this.user.create(userToRegister);
      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new BadRequestException('Email already used');
        }
      }
      throw new BadRequestException('an unknown error happened');
    }
  }

  @Post('/login')
  @UseGuards(PassportAuthGuard('local'))
  @ApiCreatedResponse({
    description: 'Successful login',
    type: PublicUserModel,
  })
  async login(@Res({ passthrough: true }) res: Response, @Auth() auth: UserModel, @Body() _userToLogin: UserToLoginDTO) {
    const { password, refresh, ...user } = auth;
    this.createSignInCookies(auth, res);

    return user;
  }

  createSignInCookies(auth: UserModel, res: Response) {
    const accessToken = this.auth.signAccessToken(auth.id, auth.email, auth.role);

    const refreshToken = this.auth.signRefreshToken(auth.id, auth.refresh);

    this.auth.setCookie(res, 'access-token', accessToken, this.auth.getAccessTokenExpires());
    this.auth.setCookie(res, 'refresh-token', refreshToken, this.auth.getRefreshTokenExpires());
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

  @Post('/logout')
  async logout(@Res({ passthrough: true }) res: Response, @Body('id') id: number) {
    res.clearCookie('access-token');
    res.clearCookie('refresh-token');

    await this.user.resetRefreshToken(id);
    return { message: 'Logged out successfully' };
  }
}
