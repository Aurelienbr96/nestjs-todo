import { Module } from '@nestjs/common';

import { TrainingController } from './training.controller';
import { TrainingService } from './training.service';

@Module({
  providers: [TrainingService],
  controllers: [TrainingController],
  exports: [TrainingService],
})
export class TrainingModule {}
