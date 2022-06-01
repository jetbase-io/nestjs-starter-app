import { IsNotEmpty, MinLength } from 'class-validator';

export class DeleteUserDto {
  @IsNotEmpty()
  @MinLength(6)
  username: string;
}
