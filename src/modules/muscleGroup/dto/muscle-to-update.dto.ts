import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class MuscleToUpdateDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description!: string;
}
