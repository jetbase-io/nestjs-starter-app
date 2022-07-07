import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActivateSubscriptionDto {
  @ApiProperty({ example: 'email', description: 'Unique email' })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @MinLength(6)
  email: string;

  @ApiProperty({ example: 'pay_asdfas4f4ffw', description: 'Payment method' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  paymentMethod: string;

  @ApiProperty({ example: 'pay_asdfas4f4ffw', description: 'Payment method' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  priceId: string;
}
