import { SaveableUserEntity, UserEntity } from './users.entity';
import { UserModel } from './users.model';

export class UsersMapper {
  static toDto(from: UserEntity): UserModel {
    const {
      email,
      customerStripeId,
      subscriptionId,
      roles,
      confirmationToken,
      confirmedAt,
      username,
      avatar,
      password,
      id,
      created_at,
      updated_at,
    } = from;

    return new UserModel(
      id,
      created_at,
      updated_at,
      email,
      customerStripeId,
      subscriptionId,
      roles,
      confirmationToken,
      confirmedAt,
      username,
      avatar,
      password,
    );
  }

  static toEntity(from: UserModel): SaveableUserEntity {
    const {
      email,
      customerStripeId,
      subscriptionId,
      roles,
      confirmationToken,
      confirmedAt,
      username,
      avatar,
      password,
      userId,
      createdAt,
      updatedAt,
    } = from;

    return {
      id: userId,
      created_at: createdAt,
      updated_at: updatedAt,
      email,
      customerStripeId,
      subscriptionId,
      roles,
      confirmationToken,
      confirmedAt,
      username,
      avatar,
      password,
    };
  }
}
