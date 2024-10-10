import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class UuidParam {
  @IsUUID()
  @ApiProperty({ required: true })
  id: string;
}

export class UuidListParam {
  @ApiProperty({ required: true })
  @IsArray()
  @IsUUID('all', { each: true })
  ids: string[];
}
