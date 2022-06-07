import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInUserDto {
  @ApiProperty({ example: 'username', description: 'Unique username' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  username: string;

  @ApiProperty({ example: 'password123', description: 'Password' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}