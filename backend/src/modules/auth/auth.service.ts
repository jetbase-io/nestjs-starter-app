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
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async signUp(createUserDto: CreateUserDto) {
    await this.usersService.validateUsername(createUserDto.username);
    const user = await this.usersService.create({
      ...createUserDto,
    });
    return this.generateToken(user);
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.usersService.findByUsername(userDto.username);
    const isPasswordsEqual = await this.usersService.isPasswordValid(
      userDto.password,
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
    const payload = { id: user.id, username: user.username };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
