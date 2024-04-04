import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class MuscleToDeleteDTO {
  @ApiProperty()
  @IsArray()
  ids!: number;
}

export class ManyMuscleToDeleteDTO {
  @ApiProperty()
  @IsArray()
  ids!: number[];
}
