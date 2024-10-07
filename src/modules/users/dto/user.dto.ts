import { BaseEntityDto } from 'src/modules/base-entity.dto';
import { UserEntity } from '../models/users.entity';
import { Role } from 'src/modules/roles/enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserEntityDto extends BaseEntityDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
  @ApiProperty({ nullable: true })
  customerStripeId: string | null;
  @ApiProperty({ nullable: true })
  subscriptionId: string | null;
  @ApiProperty({ enum: Role, type: Role })
  roles: Role;
  @ApiProperty({ nullable: true })
  avatar: string | null;
  @ApiProperty({ nullable: true })
  confirmationToken: string | null;
  @ApiProperty({ nullable: true })
  confirmedAt: Date | null;

  @Exclude()
  password: string;

  static fromEntity(entity: UserEntity): UserEntityDto {
    const baseDto = BaseEntityDto.fromEntity(entity);

    const dto = new UserEntityDto();
    Object.assign(dto, baseDto);

    dto.username = entity.username;
    dto.email = entity.email;
    dto.customerStripeId = entity.customerStripeId;
    dto.subscriptionId = entity.subscriptionId;
    dto.roles = entity.roles;
    dto.avatar = entity.avatar;
    dto.confirmationToken = entity.confirmationToken;
    dto.confirmedAt = entity.confirmedAt;
    dto.password = entity.password;

    return dto;
  }
}
