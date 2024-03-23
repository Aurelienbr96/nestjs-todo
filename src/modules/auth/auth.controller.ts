import { Body, Controller, Post } from '@nestjs/common';

import { UserService } from '../user';

import { UserToRegisterDTO } from './dto/user-to-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private user: UserService) {}

  @Post('/register')
  async register(@Body() userToRegister: UserToRegisterDTO) {
    const { password, ...user } = await this.user.create(userToRegister);
    return user;
  }
}
