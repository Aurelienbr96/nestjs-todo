import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { Response } from 'express';

import { ConfigService } from '../common';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, private config: ConfigService) {}

  signAccessToken(id: number, email: string, role: Role) {
    const secret = this.config.get('JWT_SECRET_KEY');
    return this.jwt.sign({ sub: id, email, role }, { expiresIn: '5m', secret });
  }

  signRefreshToken(id: number, uuid: string) {
    const secret = this.config.get('JWT_REFRESH_SECRET_KEY');
    return this.jwt.sign(
      { sub: uuid, userId: id },
      { expiresIn: '7d', secret },
    );
  }

  getAccessTokenExpires() {
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);
    return expires;
  }

  getRefreshTokenExpires() {
    const refreshExpires = new Date();
    refreshExpires.setDate(refreshExpires.getDate() + 7);
    return refreshExpires;
  }

  setCookie(res: Response, key: string, content: string, expires: Date) {
    res.cookie(key, content, {
      httpOnly: true,
      secure: true,
      sameSite: true,
      expires,
    });
  }
}
