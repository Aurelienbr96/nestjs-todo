import { Exercise } from '@prisma/client';

type MuscleGroupIds = { muscleGroupIds: number[] };

type ExerciseContent = Exercise & MuscleGroupIds;

export class ExerciseFixture {
  static generate(
    partial: Partial<ExerciseContent> & Pick<ExerciseContent, 'id' | 'userId' | 'muscleGroupIds'>,
  ): ExerciseContent {
    const { id, ...muscleGroup } = partial;
    return {
      id,
      name: `exercise-${id}`,
      description: `exercise-description-${id}`,
      ...muscleGroup,
    };
  }
}
