import { ApiProperty } from '@nestjs/swagger';

export class PublicMuscleGroupModel {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;
}

export class PublicMuscleGroupDeleteManyModel {
  @ApiProperty()
  ids!: number[];
}
