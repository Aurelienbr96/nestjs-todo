import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { DeletedMuscleGroup } from './MuscleGroup';

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
