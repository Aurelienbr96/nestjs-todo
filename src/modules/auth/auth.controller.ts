import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';

import { UserService } from '../user';

import { UserToRegisterDTO } from './dto/user-to-register.dto';
import { PublicUserModel } from './type';

@Controller('auth')
export class AuthController {
  constructor(private user: UserService) {}

  @ApiCreatedResponse({ description: 'Account created', type: PublicUserModel })
  @Post('/register')
  async register(@Body() userToRegister: UserToRegisterDTO) {
    const { password, ...user } = await this.user.create(userToRegister);
    return user;
  }
}
