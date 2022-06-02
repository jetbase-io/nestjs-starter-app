import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './models/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    createUserDto.password = await this.generateHashPassword(
      createUserDto.password,
    );
    return await this.userRepository.save(createUserDto);
  }

  async findByUsername(username: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ username });
  }

  async generateHashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
