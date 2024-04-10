import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserToCoachService } from './user-to-coach.service';

@Module({
  providers: [UserService, UserToCoachService],
  imports: [JwtModule],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
