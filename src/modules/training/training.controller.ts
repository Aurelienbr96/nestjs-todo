import { Body, Controller, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { TrainingService } from './training.service';
import { TrainingToCreateDTO } from './dto/training-to-create.dto';
import { TrainingWithExercises, flattenTraining } from './utils';

@ApiTags('training')
@Controller('training')
export class TrainingController {
  constructor(private training: TrainingService) {}

  @ApiOperation({ summary: 'Get the list of training' })
  @Get()
  async getAllTraining(@Query('page', ParseIntPipe) page: number) {
    return this.training.findByPage(page);
  }

  @ApiOperation({ summary: 'Create a training' })
  @Post()
  async createTraining(@Body() training: TrainingToCreateDTO) {
    const createdTraining = await this.training.create(training);
    const flattenedTraining = flattenTraining(createdTraining as TrainingWithExercises);
    return flattenedTraining;
  }
}
