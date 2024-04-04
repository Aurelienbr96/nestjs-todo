import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PublicMuscleGroupModel {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;
}

export class PublicMuscleToUpdateGroupModel {
  @ApiProperty()
  @IsOptional()
  name!: string;

  @ApiProperty()
  @IsOptional()
  description!: string;
}

export class DeletedMuscleGroup extends PublicMuscleGroupModel {
  @ApiProperty()
  id!: string;
}

export class UpdatedMuscleGroup extends PublicMuscleGroupModel {
  @ApiProperty()
  id!: string;
}

export class DeletedMusclesGroup {
  @ApiProperty()
  count!: number;
}

export class PublicMuscleGroupDeleteManyModel {
  @ApiProperty()
  ids!: number[];
}
