import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ExerciseService } from './exercise.service';
import * as Documentation from './type/Documentation';
import { ExerciseToCreateDTO, ExerciseToUpdateDTO } from './dto';
import { flattenExercise } from './utils';
import { ExerciseWithMuscleGroups } from './type/Exercise';

@ApiTags('exercise')
@Controller('exercise')
export class ExerciseController {
  constructor(private exercise: ExerciseService) {}

  @Documentation.ExerciseOperationGetAll()
  @Get()
  async getAllExercises(@Query('page', ParseIntPipe) page: number) {
    const paginatedExercises = await this.exercise.findByPage(page);
    return {
      pages: paginatedExercises.pages,
      exercises: flattenExercise(paginatedExercises.exercises as Array<ExerciseWithMuscleGroups>),
    };
  }

  @Documentation.ExerciseOperationPost()
  @Post()
  async createExercise(@Body() exercise: ExerciseToCreateDTO) {
    const ex = await this.exercise.create(exercise);
    return ex;
  }

  @Documentation.ExerciseOperationGetOne()
  @Get('/:id')
  async findExercise(@Param('id', ParseIntPipe) id: number) {
    const exercise = await this.exercise.findUnique(id);
    if (!exercise) throw new NotFoundException(`the exercise for id:${id} has not been found`);
    return flattenExercise(exercise as ExerciseWithMuscleGroups);
  }

  @Put(':id')
  @Documentation.ExerciseOperationUpdate()
  async updateExercise(@Param('id', ParseIntPipe) id: number, @Body() exercise: ExerciseToUpdateDTO) {
    const updatedExercise = await this.exercise.update(id, exercise);
    return flattenExercise(updatedExercise as ExerciseWithMuscleGroups);
  }

  @Documentation.ExerciseOperationDelete()
  @Delete(':id')
  deleteExercise(@Param('id', ParseIntPipe) id: number) {
    return this.exercise.delete(id);
  }
}
