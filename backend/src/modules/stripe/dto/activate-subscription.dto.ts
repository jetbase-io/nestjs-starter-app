import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActivateSubscriptionDto {
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
