import { ApiProperty } from '@nestjs/swagger';

export class PublicExerciseModel {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  muscleGroupIds!: number[];

  @ApiProperty()
  userId!: number;
}

export class CreatedExercise extends PublicExerciseModel {
  @ApiProperty()
  id!: number;
}
