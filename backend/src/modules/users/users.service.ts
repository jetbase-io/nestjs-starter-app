import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from './models/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UsersEntity> {
    createUserDto.password = await this.generateHashPassword(
      createUserDto.password,
    );
    return await this.userRepository.save(createUserDto);
  }

  async generateHashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
