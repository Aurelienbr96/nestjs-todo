import { Module } from '@nestjs/common';

import { CommonModule } from './common';
import { UserModule } from './user';
import { AuthModule } from './auth';

@Module({
  imports: [CommonModule, UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
