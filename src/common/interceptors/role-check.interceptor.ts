import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as jwt from 'jsonwebtoken';
import { getSecrets } from 'src/utils/helpers/getSecrets';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class RoleCheckInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((tokens) => {
        const { secretForAccessToken } = getSecrets(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          Role.ADMIN,
        );

        this.verifyToken(tokens.accessToken, secretForAccessToken);

        return tokens;
      }),
    );
  }

  private verifyToken(token: string, secret: string): any {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      throw new ForbiddenException('Forbidden resource');
    }
  }
}
