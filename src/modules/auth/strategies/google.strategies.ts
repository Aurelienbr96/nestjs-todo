/* eslint-disable @typescript-eslint/ban-ts-comment */
// google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

import { Config, ConfigService } from '../../common';
import { UserService } from '../../user'; // Assume you have a service for user operations

// THIS SHOULD BE THE STRATEGY FOR OAUTH SERVER SIDE
// WE ARE USING CLIENT SIDE OAUTH
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly usersService: UserService, config: ConfigService) {
    super({
      clientID: config.get(Config.GoogleClientId),
      clientSecret: config.get(Config.GoogleCodeSecret),
      callbackURL: config.get(Config.GoogleCallBackUrl),
      scope: ['email', 'profile'],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: any) {
    const { emails } = profile;
    let user = await this.usersService.findByEmail(emails[0].value);

    if (!user) {
      const newUser = {
        email: emails[0].value,
      };
      // @ts-expect-error
      user = await this.usersService.createFromGoogle({ email: newUser.email, googleId: '123', state: {} });
    }

    return user;
  }
}
