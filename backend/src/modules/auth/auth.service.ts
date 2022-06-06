import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserEntity } from '../users/models/users.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto.username, userDto.password);
    return this.generateToken(user);
  }

  async signUp(createUserDto: CreateUserDto) {
    await this.usersService.validateUsername(createUserDto.username);
    const user = await this.usersService.create({
      ...createUserDto,
    });
    return this.generateToken(user);
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

  private async generateToken(user: UserEntity) {
    const payload = {
      id: user.id,
      username: user.username,
      password: user.password,
      roles: user.roles,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
