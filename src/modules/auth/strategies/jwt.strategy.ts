/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { Config, ConfigService } from '../../common';
import { AuthPayload, JWTPayload } from '../type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      // @ts-ignore
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => request.cookies['access-token']]),
      ignoreExpiration: false,
      secretOrKey: config.get(Config.Secret),
    });
  }

  async validate(payload: JWTPayload<AuthPayload>) {
    const { sub, role } = payload;
    return { sub, role };
  }
}
