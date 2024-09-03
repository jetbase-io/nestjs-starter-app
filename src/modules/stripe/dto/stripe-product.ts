import { MinLength, IsString, IsNotEmpty } from 'class-validator';

export class CreateStripeProductDto {
  @IsNotEmpty()
  @MinLength(1)
  @IsString()
  name: string;
}
