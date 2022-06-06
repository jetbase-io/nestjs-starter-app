import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'test1234', description: 'New password' })
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;

  @ApiProperty({ example: 'test1234', description: 'Confirm password' })
  @IsNotEmpty()
  @MinLength(6)
  confirmPassword: string;

  @ApiProperty({ example: 'test4321', description: 'Old password' })
  @IsNotEmpty()
  @MinLength(6)
  oldPassword: string;
}
