import {
  IsNotEmpty,
  MinLength,
  Validate,
  ValidationArguments,
} from 'class-validator';
import { UsernameUnique } from '../validator/user-unique.validator';
import { UserEntity } from '../models/users.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'username', description: 'Unique username' })
  @IsNotEmpty()
  @MinLength(6)
  @Validate(UsernameUnique, [UserEntity, ['username']], {
    message: ({ targetName, constraints, property }: ValidationArguments) =>
      `${targetName} with the same pair of ${property} already exist`,
  })
  username: string;

  @ApiProperty({ example: 'password123', description: 'Password' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
