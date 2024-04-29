import { Module } from '@nestjs/common';

import { CommonModule } from './common';
import { UserModule } from './user';
import { AuthModule } from './auth';
import { MuscleGroupModule } from './muscleGroup';
import { ExerciseModule } from './exercise';
import { AppController } from './app.controller';

@Module({
  imports: [CommonModule, UserModule, AuthModule, MuscleGroupModule, ExerciseModule, UserModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
