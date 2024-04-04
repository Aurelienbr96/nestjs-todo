import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MuscleToCreateDTO {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  description!: string;
}
