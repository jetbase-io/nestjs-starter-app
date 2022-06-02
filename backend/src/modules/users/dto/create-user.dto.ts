import {
  IsNotEmpty,
  MinLength,
  Validate,
  ValidationArguments,
} from 'class-validator';
import { UsernameUnique } from '../validator/user-unique.validator';
import { UserEntity } from '../models/users.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(6)
  @Validate(UsernameUnique, [UserEntity, ['username']], {
    message: ({ targetName, constraints, property }: ValidationArguments) =>
      `${targetName} with the same pair of ${property} already exist`,
  })
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
