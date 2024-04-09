import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '../user';

import { AuthController } from './auth.controller';
import { LocalStrategy, RefreshJwtStrategy, JwtStrategy } from './strategies';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategies';

@Module({
  imports: [UserModule, PassportModule, JwtModule],
  controllers: [AuthController],
  providers: [LocalStrategy, AuthService, RefreshJwtStrategy, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}
