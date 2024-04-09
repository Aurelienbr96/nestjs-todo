/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { ConfigService } from '../../common';
import { JWTPayload, RefreshPayload } from '../type';
import { UserService } from '../../user';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(config: ConfigService, private user: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // @ts-ignore
        (request: Request) => request.cookies['refresh-token'],
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_REFRESH_SECRET_KEY'),
    });
  }

  async validate(payload: JWTPayload<RefreshPayload>) {
    const user = await this.user.findByRefresh(payload.sub, payload.userId);

    if (!user) throw new UnauthorizedException();

    return this.user.updateRefreshToken(user.id, uuid());
  }
}
