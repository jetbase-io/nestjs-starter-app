import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @MinLength(6)
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
