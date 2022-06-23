import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './models/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesService } from '../roles/roles.service';
import { CreateUserByRoleDto } from './dto/create-user-by-role.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly roleService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userRole = await this.roleService.getRoleByValue('USER');
    const user = new UserEntity();
    user.username = createUserDto.username;
    user.password = await this.generateHashPassword(createUserDto.password);
    user.roles = userRole;
    return await this.userRepository.save(user);
  }

  async createByRole(createUserDto: CreateUserByRoleDto): Promise<UserEntity> {
    const userRole = await this.roleService.getRoleByValue(createUserDto.role);
    const user = new UserEntity();
    user.username = createUserDto.username;
    user.password = await this.generateHashPassword(createUserDto.password);
    user.roles = userRole;
    return await this.userRepository.save(user);
  }

  async getOne(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne({ id });
  }

  async updateOne(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    await this.isUserExist(id);
    await this.validateUsername(updateUserDto.username);
    await this.userRepository.update(id, updateUserDto);
    return updateUserDto;
  }

  async deleteOne(id: number): Promise<{ message: string }> {
    await this.isUserExist(id);
    await this.userRepository.delete(id);
    return {
      message: 'User deleted successfully!',
    };
  }

  async validateUsername(username: string): Promise<UserEntity> {
    const user = await this.findByUsername(username);
    if (user) {
      throw new BadRequestException({ message: 'User already exist' });
    }
    return user;
  }

  async findByUsername(username: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { username: username },
      relations: ['roles'],
    });
  }

  async generateHashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async updatePassword(userId: number, password: string) {
    const hashedNewPassword = await this.generateHashPassword(password);
    await this.userRepository.update(userId, { password: hashedNewPassword });
  }

  async isPasswordValid(password: string, user: UserEntity): Promise<boolean> {
    if (user && user.password) {
      return await bcrypt.compare(password, user.password);
    }
    return false;
  }

  async isUserExist(id): Promise<boolean> {
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new BadRequestException({
        message: 'User with provided id does not exist!',
      });
    }
    return true;
  }
}
