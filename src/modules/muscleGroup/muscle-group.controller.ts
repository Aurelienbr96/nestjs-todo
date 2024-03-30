import { Body, Controller, Post, Get, Param, Put, NotFoundException, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { UseAuthGuard } from '../auth/decorators/use-auth-guard.decorator';

import { MuscleToCreateDTO, MuscleToUpdateDTO } from './dto';
import { MuscleGroupService } from './muscle-group.service';
import { DeletedMusclesGroup, PublicMuscleGroupModel, UpdatedMuscleGroup } from './type/MuscleGroup';
import * as Documentation from './type/Documentation';

@ApiTags('muscle-group')
@Controller('muscle-group')
export class MuscleGroupController {
  constructor(private muscleGroup: MuscleGroupService) {}

  @ApiOperation({ summary: 'Create a specific muscle group' })
  @ApiCreatedResponse({
    description: 'Muscle group created',
    type: PublicMuscleGroupModel,
  })
  @Post()
  async create(@Body() muscleGroup: MuscleToCreateDTO) {
    const createdMuscleGroup = await this.muscleGroup.create(muscleGroup);
    return createdMuscleGroup;
  }

  @ApiOkResponse({
    description: 'Muscle groups found',
    type: [PublicMuscleGroupModel],
  })
  @ApiOperation({ summary: 'Find a list of muscle group' })
  @Get()
  async findAll() {
    const muscleGroup = await this.muscleGroup.findAll();
    return muscleGroup;
  }

  @ApiOperation({ summary: 'Get one muscle group' })
  @ApiCreatedResponse({
    description: 'Get one muscle group',
    type: PublicMuscleGroupModel,
  })
  @Get(':id')
  async findUnique(@Param('id', ParseIntPipe) id: number) {
    const muscleGroup = await this.muscleGroup.findUnique(id);
    if (!muscleGroup) throw new NotFoundException(`the muscle group for id:${id} has not been found`);
    return muscleGroup;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a specific muscle group' })
  @ApiOkResponse({ description: 'Resource updated successfully', type: UpdatedMuscleGroup })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @UseAuthGuard(Role.ADMIN)
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: MuscleToUpdateDTO) {
    const muscleGroup = await this.muscleGroup.update(id, data);
    if (!muscleGroup) throw new NotFoundException(`the muscle group for id:${id} has not been found`);
    return muscleGroup;
  }

  @Delete(':id')
  @Documentation.MuscleGroupOperationDelete()
  @UseAuthGuard(Role.ADMIN)
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.muscleGroup.delete(id);
    } catch (e) {
      throw new NotFoundException(`the muscle group for id:${id} has not been found`);
    }
  }

  @ApiOperation({ summary: 'Delete a specific muscle group' })
  @ApiOkResponse({
    description: 'list of muscle group deleted',
    type: DeletedMusclesGroup,
  })
  @ApiNotFoundResponse({
    description: 'Muscle group with given ids does not exist',
  })
  @UseAuthGuard(Role.ADMIN)
  @Delete()
  async deleteMany(@Body('ids') ids: number[]) {
    const result = await this.muscleGroup.deleteMany(ids);

    if (result.count === 0) {
      throw new NotFoundException(`Muscle groups with IDs ${ids.join(', ')} have not been found.`);
    }
    return result;
  }
}
