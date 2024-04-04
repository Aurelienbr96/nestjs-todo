import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class SetToCreateDTO {
  @ApiProperty()
  @IsNumber()
  weight!: number;

  @ApiProperty()
  @IsNumber()
  rest!: number;

  @ApiProperty()
  @IsNumber()
  reps!: number;
}

class ExerciseToLinkDTO {
  @ApiProperty()
  @IsNumber()
  id!: number;

  @ApiProperty()
  @IsNumber()
  restAfterExercise!: number;

  @ApiProperty({ type: [SetToCreateDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SetToCreateDTO)
  sets!: SetToCreateDTO[];
}

export class TrainingToCreateDTO {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty({ type: [ExerciseToLinkDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseToLinkDTO)
  exercises!: ExerciseToLinkDTO[];

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  userId!: number;
}

export class TrainingToUpdateDTO extends TrainingToCreateDTO {
  @ApiProperty()
  @IsNumber()
  id!: number;
}
