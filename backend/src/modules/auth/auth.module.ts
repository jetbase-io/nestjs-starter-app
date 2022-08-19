import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './models/refreshTokens.entity';
import { ExpiredAccessTokenEntity } from './models/expiredAccessTokens.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([RefreshTokenEntity, ExpiredAccessTokenEntity]),
    PassportModule.register({
      session: false,
    }),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
