import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `.${process.env.NODE_ENV}.${process.env.ACCESS_TOKEN_JWT_SECRET}`,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const accessToken = req.get('authorization').replace('Bearer', '').trim();
    const isTokenExpired = await this.authService.isAccessTokenExpired(
      payload['id'],
      accessToken,
    );
    if (isTokenExpired) {
      throw new UnauthorizedException('Access Denied');
    }
    return { ...payload, accessToken };
  }
}
