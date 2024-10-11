import { BaseEntityDto } from 'src/common/base/classes/base-entity.dto';
import { SaveableUserEntity, UserEntity } from '../models/users.entity';
import { Role } from 'src/common/enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { PaginationResponseDto } from 'src/modules/admin/dto/pagination-response.dto';
import { UpdateResult } from 'typeorm';
import { UserModel } from '../models/users.model';

export class PaginatedUsersResponseDto extends PaginationResponseDto<UserEntityDto> {
  static invoke(
    data: [UserEntity[], number],
  ): PaginationResponseDto<UserEntityDto> {
    const userDtos = data[0].map((u) => UserEntityDto.invoke(u));
    const dto = PaginationResponseDto.generateResponse([userDtos, data[1]]);

    return dto;
  }
}

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

  static invoke(entity: UserEntity): UserEntityDto {
    const baseDto = BaseEntityDto.invoke(entity);

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

    return dto;
  }
}

export class UploadUserAvatarDto {
  @ApiProperty({ format: 'binary', type: 'string', required: true })
  file: Express.Multer.File;
}

export class UploadUserAvatarResponseDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  avatar: string;

  static invoke(body: UpdateResult): UploadUserAvatarResponseDto {
    const dto = new UploadUserAvatarResponseDto();

    const { username, avatar } = body.raw[0];

    dto.username = username;
    dto.avatar = avatar;

    return dto;
  }
}
