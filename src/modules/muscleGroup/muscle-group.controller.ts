import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';

import { MuscleToCreateDTO, MuscleToUpdateDTO } from './dto';
import { MuscleGroupService } from './muscle-group.service';
import {
  PublicMuscleGroupDeleteManyModel,
  PublicMuscleGroupModel,
} from './type/MuscleGroup';

@Controller('muscle-group')
export class MuscleGroupController {
  constructor(private muscleGroup: MuscleGroupService) {}

  @ApiCreatedResponse({
    description: 'Muscle group created',
    type: PublicMuscleGroupModel,
  })
  @Post()
  async create(@Body() muscleGroup: MuscleToCreateDTO) {
    const createdMuscleGroup = await this.muscleGroup.create(muscleGroup);
    return createdMuscleGroup;
  }

  @ApiCreatedResponse({
    description: 'Get all muscle group',
    type: PublicMuscleGroupModel,
    isArray: true,
  })
  @Get()
  async findAll() {
    const muscleGroup = await this.muscleGroup.findAll();
    return muscleGroup;
  }

  @ApiCreatedResponse({
    description: 'Get one muscle group',
    type: PublicMuscleGroupModel,
  })
  @Get(':id')
  async findUnique(@Param('id') id: string) {
    const muscleGroup = await this.muscleGroup.findUnique(parseInt(id));
    if (!muscleGroup)
      throw new NotFoundException(
        `the muscle group for id:${id} has not been found`,
      );
    return muscleGroup;
  }

  @ApiCreatedResponse({
    description: 'Update one muscle group',
    type: PublicMuscleGroupModel,
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: MuscleToUpdateDTO) {
    const muscleGroup = await this.muscleGroup.update(parseInt(id), data);
    if (!muscleGroup)
      throw new NotFoundException(
        `the muscle group for id:${id} has not been found`,
      );
    return muscleGroup;
  }

  @ApiCreatedResponse({
    description: 'Delete one muscle group',
    type: PublicMuscleGroupModel,
  })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const muscleGroup = await this.muscleGroup.delete(parseInt(id));

    if (!muscleGroup)
      throw new NotFoundException(
        `the muscle group for id:${id} has not been found`,
      );
    return muscleGroup;
  }

  @ApiCreatedResponse({
    description: 'Delete multiple muscle group',
    type: PublicMuscleGroupDeleteManyModel,
  })
  @Delete()
  async deleteMany(@Body('ids') ids: number[]) {
    const result = await this.muscleGroup.deleteMany(ids);

    if (result.count === 0) {
      throw new NotFoundException(
        `Muscle groups with IDs ${ids.join(', ')} have not been found.`,
      );
    }
    return result;
  }
}
