import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateUserConfirmationDto {
  @IsUUID()
  @IsNotEmpty()
  token: string;
}
