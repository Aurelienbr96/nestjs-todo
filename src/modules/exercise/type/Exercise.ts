import { ApiProperty } from '@nestjs/swagger';
import { Exercise, MuscleGroup } from '@prisma/client';

export class PublicExerciseModel {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  muscleGroupIds!: number[];

  @ApiProperty()
  userId!: number;
}

export class CreatedExercise extends PublicExerciseModel {
  @ApiProperty()
  id!: number;
}

interface ExerciseMuscleGroup {
  muscleGroup: MuscleGroup;
}

export interface ExerciseWithMuscleGroups extends Exercise {
  muscleGroups: ExerciseMuscleGroup[];
}
