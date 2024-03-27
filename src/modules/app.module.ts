import { Module } from '@nestjs/common';

import { CommonModule } from './common';
import { UserModule } from './user';
import { AuthModule } from './auth';
import { MuscleGroupModule } from './muscleGroup';

@Module({
  imports: [CommonModule, UserModule, AuthModule, MuscleGroupModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
