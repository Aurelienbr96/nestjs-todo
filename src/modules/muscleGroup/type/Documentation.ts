import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { DeletedMuscleGroup, PublicMuscleGroupModel, UpdatedMuscleGroup } from './MuscleGroup';

export function MuscleGroupOperationDelete() {
  return applyDecorators(
    ApiOkResponse({
      description: 'muscle group deleted',
      type: DeletedMuscleGroup,
    }),
    ApiNotFoundResponse({
      description: 'Muscle group with given id does not exist',
    }),
    ApiOperation({ summary: 'Delete a muscle group' }),
  );
}

export function MuscleGroupOperationDeleteMany() {
  return applyDecorators(
    ApiOkResponse({
      description: 'list of muscle group deleted',
      type: DeletedMuscleGroup,
    }),
    ApiNotFoundResponse({
      description: 'Muscle group with given ids does not exist',
    }),
    ApiOperation({ summary: 'Delete many muscle group' }),
  );
}

export function MuscleGroupOperationUpdate() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Resource updated successfully',
      type: UpdatedMuscleGroup,
    }),
    ApiNotFoundResponse({
      description: 'Resource not found',
    }),
    ApiOperation({ summary: 'Update a specific muscle group' }),
  );
}

export function MuscleGroupOperationGetOne() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Get one muscle group',
      type: PublicMuscleGroupModel,
    }),
    ApiOperation({ summary: 'Get one muscle group' }),
  );
}

export function MuscleGroupOperationGetAll() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Muscle groups found',
      type: [PublicMuscleGroupModel],
    }),
    ApiOperation({ summary: 'Find a list of muscle group' }),
  );
}

export function MuscleGroupOpenrationCreate() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a specific muscle group' }),
    ApiCreatedResponse({
      description: 'Muscle group created',
      type: PublicMuscleGroupModel,
    }),
  );
}
