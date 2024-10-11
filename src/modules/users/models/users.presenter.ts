import { IPresenter } from 'src/common/types/presenter.type';
import { UserEntityDto } from '../dto/user.dto';
import { UserModel } from './users.model';
import { Injectable } from '@nestjs/common';

export type IUserPresenter = IPresenter<UserModel, UserEntityDto>;

@Injectable()
export class UserPresenter implements IUserPresenter {
  toResponseDto(user: UserModel): UserEntityDto {
    const dto = new UserEntityDto();

    dto.id = user.userId;
    dto.created_at = user.createdAt;
    dto.updated_at = user.updatedAt;

    dto.username = user.username;
    dto.email = user.email;
    dto.customerStripeId = user.customerStripeId;
    dto.subscriptionId = user.subscriptionId;
    dto.roles = user.roles;
    dto.avatar = user.avatar;
    dto.confirmationToken = user.confirmationToken;
    dto.confirmedAt = user.confirmedAt;

    return dto;
  }

  toResponseDtoList(users: UserModel[]): UserEntityDto[] {
    return users.map(this.toResponseDto);
  }
}
