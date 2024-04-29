import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

class StateDto {
  @ApiProperty()
  @IsString()
  role!: Role;
}

class GoogleCredentialDTO {
  @ApiProperty()
  @IsString()
  credential!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  clientId!: string;

  @ApiProperty()
  @IsString()
  select_by!: string;
}

export class GoogleAuthDTO {
  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => GoogleCredentialDTO)
  googleCredential!: GoogleCredentialDTO;

  @ApiProperty()
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => StateDto)
  state!: StateDto;
}
