import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class PublicUserModel {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  referalCode!: string;

  @ApiProperty()
  role!: Role;

  @ApiProperty()
  googleId!: string;
}

export class UserModel extends PublicUserModel {
  @ApiProperty()
  password!: string;

  @ApiProperty()
  refresh!: string;
}
