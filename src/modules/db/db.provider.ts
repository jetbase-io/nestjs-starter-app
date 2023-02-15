import { UserEntity } from '../users/models/users.entity';
import { RefreshTokenEntity } from '../auth/models/refreshTokens.entity';
import { ExpiredAccessTokenEntity } from '../auth/models/expiredAccessTokens.entity';

export const entities = [
  UserEntity,
  RefreshTokenEntity,
  ExpiredAccessTokenEntity,
];
