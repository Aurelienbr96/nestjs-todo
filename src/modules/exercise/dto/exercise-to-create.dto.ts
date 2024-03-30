import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class ExerciseToCreateDTO {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty()
  @IsArray()
  muscleGroupIds!: number[];

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  userId!: number;
}

export class ExerciseToUpdateDTO extends ExerciseToCreateDTO {
  @ApiProperty()
  @IsNumber()
  id!: number;
}
