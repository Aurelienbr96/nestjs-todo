import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class PublicUserModel {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  role!: Role;

  @ApiProperty()
  refresh!: string;
}

export class UserModel extends PublicUserModel {
  @ApiProperty()
  password!: string;
}
