import { Module } from '@nestjs/common';

import { MuscleGroupModule } from '../muscleGroup';

import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';

@Module({
  providers: [ExerciseService],
  imports: [MuscleGroupModule],
  controllers: [ExerciseController],
  exports: [ExerciseService],
})
export class ExerciseModule {}
