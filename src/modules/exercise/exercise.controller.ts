import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ExerciseService } from './exercise.service';
import { ExerciseToCreateDTO, ExerciseToUpdateDTO } from './dto';
import { CreatedExercise } from './type/Exercise';
import { ExerciseWithMuscleGroups, flattenExercise } from './utils';

@ApiTags('exercise')
@Controller('exercise')
export class ExerciseController {
  constructor(private exercise: ExerciseService) {}

  @ApiOperation({ summary: 'Get the list of exercises' })
  @Get()
  async getAllExercises(@Query('page', ParseIntPipe) page: number) {
    const paginatedExercises = await this.exercise.findByPage(page);
    return {
      pages: paginatedExercises.pages,
      exercises: flattenExercise(paginatedExercises.exercises as Array<ExerciseWithMuscleGroups>),
    };
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Create one exercise',
    type: CreatedExercise,
  })
  createExercise(@Body() exercise: ExerciseToCreateDTO) {
    return this.exercise.create(exercise);
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Find one exercise',
  })
  async findExercise(@Param('id', ParseIntPipe) id: number) {
    const exercise = await this.exercise.findUnique(id);
    return flattenExercise(exercise as ExerciseWithMuscleGroups);
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'The exercise has been successfully updated.',
    type: CreatedExercise,
  })
  async updateExercise(@Param('id', ParseIntPipe) id: number, @Body() exercise: ExerciseToUpdateDTO) {
    const updatedExercise = await this.exercise.update(id, exercise);
    return flattenExercise(updatedExercise as ExerciseWithMuscleGroups);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'The exercise has been successfully deleted.',
    type: CreatedExercise,
  })
  deleteExercise(@Param('id', ParseIntPipe) id: number) {
    return this.exercise.delete(id);
  }
}
