import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserEntity } from '../users/models/users.entity';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types/tokens.type';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(userDto: CreateUserDto): Promise<Tokens> {
    const user = await this.validateUser(userDto.username, userDto.password);
    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async signUp(createUserDto: CreateUserDto): Promise<Tokens> {
    await this.usersService.validateUsername(createUserDto.username);
    const user = await this.usersService.create({
      ...createUserDto,
    });
    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async signOut(userId: number) {
    console.log('Sign Out User with id: ', userId);
    console.log('Must delete refresh token from db');
    return null;
  }

  async refreshAccessToken(userId: number, refreshToken: string) {
    console.log('REFRESH SERVICE: ', refreshToken);
    const user = await this.usersService.getOne(userId);
    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return null;
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    const isPasswordsEqual = await this.usersService.isPasswordValid(
      password,
      user,
    );
    if (user && isPasswordsEqual) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'Incorrect password or username',
    });
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    console.log('updateRefreshToken: ');
    console.log('userId: ', userId);
    console.log('refreshToken: ', refreshToken);
  }

  private async generateTokens(user: UserEntity): Promise<Tokens> {
    const payload = {
      id: user.id,
      username: user.username,
      password: user.password,
      roles: user.roles,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: `.${process.env.NODE_ENV}.env.ACCESS_TOKEN_JWT_SECRET`,
        expiresIn: 60 * 15,
      }),
      this.jwtService.signAsync(payload, {
        secret: `.${process.env.NODE_ENV}.env.REFRESH_TOKEN_JWT_SECRET`,
        expiresIn: 60 * 15,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
