import { ApiProperty } from '@nestjs/swagger';

export class PublicUserModel {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  role!: string;
}
