import { IsDate, IsNotEmpty } from 'class-validator';
import { CreateUserByRoleDto } from './create-user-by-role.dto';

export class CreateUserBySeedDto extends CreateUserByRoleDto {
  @IsNotEmpty()
  @IsDate()
  confirmedAt: Date;
}
