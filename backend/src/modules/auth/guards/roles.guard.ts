import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const roles = this.reflector.get<string>('roles', context.getHandler());
    if (roles === undefined) {
      return true;
    }
    if (req.user === undefined) {
      return false;
    }

    return req.user.roles.some((role) => roles.includes(role.value));
  }
}
