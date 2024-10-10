import { Request } from 'express';
import { Role } from '../../common/enums/role.enum';

type Done = (err: Error | null, secretOrKey?: string) => void;
export const enum SecretTypes {
  ACCESS = 'secretForAccessToken',
  REFRESH = 'secretForRefreshToken',
}

export function getSecrets(userRole: Role) {
  const isRoleUser = userRole === Role.USER;
  const access = isRoleUser
    ? `.${process.env.NODE_ENV}.${process.env.ACCESS_TOKEN_JWT_SECRET}`
    : `.${process.env.NODE_ENV}.${process.env.ACCESS_TOKEN_JWT_SECRET_ADMIN}`;

  const refresh = isRoleUser
    ? `.${process.env.NODE_ENV}.${process.env.REFRESH_TOKEN_JWT_SECRET}`
    : `.${process.env.NODE_ENV}.${process.env.REFRESH_TOKEN_JWT_SECRET_ADMIN}`;

  return { [SecretTypes.ACCESS]: access, [SecretTypes.REFRESH]: refresh };
}

export const secretProvider =
  (secretType: SecretTypes) => (req: Request, _: string, done: Done) => {
    const userRole = req.originalUrl.includes('admin') ? Role.ADMIN : Role.USER;
    done(null, getSecrets(userRole)[secretType]);
  };
