import { Exercise } from '@prisma/client';

type MuscleGroupIds = { muscleGroupIds: number[] };

type ExerciseContent = Omit<Exercise, 'id'> & MuscleGroupIds;

type CreatedExercise = Exercise & MuscleGroupIds;

export class ExerciseFixture {
  static get exercise() {
    const create: ExerciseContent = {
      name: 'Chest',
      description: 'The chest is separated between 3 muscle group',
      userId: 1,
      muscleGroupIds: [4, 5],
    };

    return { create };
  }

  static get stored() {
    const exercise: CreatedExercise = {
      ...ExerciseFixture.exercise.create,
      id: 1,
    };
    const all = [exercise];
    return { exercise, all };
  }
}
