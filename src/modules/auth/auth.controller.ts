import { BadRequestException, Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard, AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { v4 as uuid } from 'uuid';

import { UserService } from '../user';
import { Config, ConfigService } from '../common';

import { UserToRegisterDTO } from './dto/user-to-register.dto';
import { PublicUserModel, UserModel } from './type';
import { Auth } from './decorators';
import { UserToLoginDTO } from './dto/user-to-login.dto';
import { AuthService } from './auth.service';
import { GoogleAuthDTO } from './dto/google-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private googleClient;
  constructor(private user: UserService, private auth: AuthService, private config: ConfigService) {
    this.googleClient = new OAuth2Client(config.get(Config.GoogleClientId));
  }

  @Post('/google')
  async googleAuth(@Body() params: GoogleAuthDTO, @Res({ passthrough: true }) res: Response) {
    let payload: TokenPayload | undefined;
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: params.googleCredential.credential,
        audience: this.config.get(Config.GoogleClientId),
      });

      payload = ticket.getPayload();
    } catch (e) {
      throw new BadRequestException();
    }

    if (!payload) {
      throw new BadRequestException();
    }

    const { sub, email } = payload;

    if (!email || !sub) {
      throw new BadRequestException('app.page.login.error.no_email_found');
    }
    let user = await this.user.findByEmail(email);

    if (!user) {
      if (!params.state) throw new BadRequestException('app.page.login.error.not_registered');
      user = await this.user.create({
        googleId: sub,
        email,
        role: params.state.role,
        password: null,
        refresh: null,
        referalCode: params.state.role === 'COACH' ? uuid() : null,
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
      const { password, refresh, ...user } = await this.user.create({
        ...userToRegister,
        referalCode: userToRegister.role === 'COACH' ? uuid() : null,
        googleId: null,
        refresh: null,
      });
      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new BadRequestException('app.page.register.error.email');
        }
      }
      throw new BadRequestException();
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
