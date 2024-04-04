import { Module } from '@nestjs/common';

import { CommonModule } from './common';
import { UserModule } from './user';
import { AuthModule } from './auth';
import { MuscleGroupModule } from './muscleGroup';
import { ExerciseModule } from './exercise';

@Module({
  imports: [CommonModule, UserModule, AuthModule, MuscleGroupModule, ExerciseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
