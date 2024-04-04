import { Body, Controller, Post, Get, Param, Put, NotFoundException, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { UseAuthGuard } from '../auth/decorators/use-auth-guard.decorator';

import { ManyMuscleToDeleteDTO, MuscleToCreateDTO, MuscleToUpdateDTO } from './dto';
import { MuscleGroupService } from './muscle-group.service';
import * as Documentation from './type/Documentation';

@ApiTags('muscle-group')
@Controller('muscle-group')
export class MuscleGroupController {
  constructor(private muscleGroup: MuscleGroupService) {}

  @Documentation.MuscleGroupOpenrationCreate()
  @Post()
  async create(@Body() muscleGroup: MuscleToCreateDTO) {
    const createdMuscleGroup = await this.muscleGroup.create(muscleGroup);
    return createdMuscleGroup;
  }

  @Documentation.MuscleGroupOperationGetAll()
  @Get()
  async findAll() {
    const muscleGroup = await this.muscleGroup.findAll();
    return muscleGroup;
  }

  @Documentation.MuscleGroupOperationGetOne()
  @Get(':id')
  async findUnique(@Param('id', ParseIntPipe) id: number) {
    const muscleGroup = await this.muscleGroup.findUnique(id);
    if (!muscleGroup) throw new NotFoundException(`the muscle group for id:${id} has not been found`);
    return muscleGroup;
  }

  @Put(':id')
  @Documentation.MuscleGroupOperationUpdate()
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

  @Documentation.MuscleGroupOperationDeleteMany()
  @UseAuthGuard(Role.ADMIN)
  @Delete()
  async deleteMany(@Body() body: ManyMuscleToDeleteDTO) {
    const result = await this.muscleGroup.deleteMany(body.ids);

    if (result.count === 0) {
      throw new NotFoundException(`Muscle groups with IDs ${body.ids.join(', ')} have not been found.`);
    }
    return result;
  }
}
