import { UserEntity } from '../users/models/users.entity';
import { RoleEntity } from '../roles/models/role.entity';
import { RefreshTokenEntity } from '../auth/models/refreshTokens.entity';
import { ExpiredAccessTokenEntity } from '../auth/models/expiredAccessTokens.entity';

export const entities = [
  UserEntity,
  RoleEntity,
  RefreshTokenEntity,
  ExpiredAccessTokenEntity,
];
