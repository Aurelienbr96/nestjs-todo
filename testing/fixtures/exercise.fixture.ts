import { Exercise } from '@prisma/client';

type MuscleGroupIds = { muscleGroupIds: number[] };

type ExerciseContent = Exercise & MuscleGroupIds;

export class ExerciseFixture {
  static generate(partial: Partial<ExerciseContent>): ExerciseContent {
    const { id, ...muscleGroup } = partial;
    return {
      id: 1,
      userId: 1,
      name: 'chest',
      description: 'pectoral muscle',
      muscleGroupIds: [1, 2],
      ...muscleGroup,
    };
  }
}
