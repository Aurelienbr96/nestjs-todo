import { Exercise, Set, Training } from '@prisma/client';

export interface TrainingWithExercises extends Training {
  exercises: Array<{ exercise: Exercise; sets: Set[] }>;
}

export const flattenTraining = (trainings: TrainingWithExercises | Array<TrainingWithExercises>) => {
  if (Array.isArray(trainings)) {
    return trainings.map((training) => ({
      ...training,
      exercises: training.exercises.map((mg) => {
        return {
          id: mg.exercise.id,
          description: mg.exercise.description,
          name: mg.exercise.name,
          sets: mg.sets,
        };
      }),
    }));
  }
  return {
    ...trainings,
    exercises: trainings.exercises.map((mg) => ({
      id: mg.exercise.id,
      description: mg.exercise.description,
      name: mg.exercise.name,
      sets: mg.sets,
    })),
  };
};
