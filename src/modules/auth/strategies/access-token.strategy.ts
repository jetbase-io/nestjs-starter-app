import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { SecretTypes, secretProvider } from '../../../utils/helpers/getSecrets';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: secretProvider(SecretTypes.ACCESS),
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
