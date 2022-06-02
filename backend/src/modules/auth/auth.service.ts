import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserEntity } from '../users/models/users.entity';
import * as bcrypt from 'bcryptjs';

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
    await this.validateUsername(createUserDto.username);
    const user = await this.usersService.create({
      ...createUserDto,
    });
    return this.generateToken(user);
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.usersService.findByUsername(userDto.username);
    const isPasswordsEqual = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (user && isPasswordsEqual) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'Incorrect password or username',
    });
  }

  private async validateUsername(username: string) {
    const user = await this.usersService.findByUsername(username);
    if (user) {
      throw new BadRequestException({ message: 'User already exist' });
    }
    return user;
  }

  private async generateToken(user: UserEntity) {
    const payload = { id: user.id, username: user.username };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
