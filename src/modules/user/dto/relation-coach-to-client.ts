import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class RelationCoachToClientToCreateDTO {
  @ApiProperty()
  @IsString()
  referalCode!: string;

  @ApiProperty()
  @IsNumber()
  clientId!: number;
}
