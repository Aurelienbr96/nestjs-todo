import { ExerciseWithMuscleGroups } from '../type/Exercise';

export const flattenExercise = (exercises: ExerciseWithMuscleGroups | Array<ExerciseWithMuscleGroups>) => {
  if (Array.isArray(exercises)) {
    return exercises.map((exercise) => ({
      ...exercise,
      muscleGroups: exercise.muscleGroups.map((mg) => mg.muscleGroup.id),
    }));
  }
  return { ...exercises, muscleGroups: exercises.muscleGroups.map((mg) => mg.muscleGroup.id) };
};
