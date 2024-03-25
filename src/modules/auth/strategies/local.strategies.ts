import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

import { UserService } from '../../user';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private user: UserService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.user.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) throw new UnauthorizedException();
    return this.user.updateRefreshToken(user.id, uuid());
  }
}
