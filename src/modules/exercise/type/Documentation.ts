import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { CreatedExercise } from './Exercise';

export function ExerciseOperationGetAll() {
  return applyDecorators(ApiOperation({ summary: 'Get the list of exercises' }));
}

export function ExerciseOperationPost() {
  return applyDecorators(
    ApiCreatedResponse({
      description: 'Create one exercise',
      type: CreatedExercise,
    }),
  );
}

export function ExerciseOperationGetOne() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Find one exercise',
    }),
  );
}

export function ExerciseOperationUpdate() {
  return applyDecorators(
    ApiOkResponse({
      description: 'The exercise has been successfully updated.',
      type: CreatedExercise,
    }),
  );
}

export function ExerciseOperationDelete() {
  return applyDecorators(
    ApiOkResponse({
      description: 'The exercise has been successfully deleted.',
      type: CreatedExercise,
    }),
  );
}
