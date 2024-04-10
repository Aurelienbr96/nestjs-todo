import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UserToRegisterDTO {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  role!: Role;
}
