import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'username', description: 'Unique username' })
  @IsNotEmpty()
  @MinLength(6)
  username: string;
}
