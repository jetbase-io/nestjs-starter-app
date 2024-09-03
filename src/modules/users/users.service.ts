import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { UserEntity } from './models/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserByRoleDto } from './dto/create-user-by-role.dto';
import { Role } from '../roles/enums/role.enum';
import { PaginationParams } from '../admin/dto/pagination-params.dto';
import { PaginationResponseDto } from '../admin/dto/pagination-response.dto';
import { getSort } from '../../utils/helpers/get-sort';
import { FileUploadService } from './fileupload.service';
import { IFile } from './file.interface';
import { readFileSync } from 'fs';
import { CreateUserBySeedDto } from './dto/create-user-by-seed.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = new UserEntity();
    user.username = createUserDto.username;
    user.password = await this.generateHashPassword(createUserDto.password);
    user.email = createUserDto.email;
    user.roles = [Role.USER];
    user.confirmationToken = createUserDto.confirmationToken;
    return await this.userRepository.save(user);
  }

  async createByRole(createUserDto: CreateUserByRoleDto): Promise<UserEntity> {
    const user = new UserEntity();
    user.username = createUserDto.username;
    user.password = await this.generateHashPassword(createUserDto.password);
    user.email = createUserDto.email;
    user.roles = [createUserDto.role];
    return await this.userRepository.save(user);
  }

  async createBySeed(createUserDto: CreateUserBySeedDto): Promise<UserEntity> {
    let user = new UserEntity();
    const { role, ...restData } = createUserDto;
    user = { ...user, ...restData };
    user.roles = [role];
    return await this.userRepository.save(user);
  }

  async getUsers(
    query: PaginationParams,
  ): Promise<PaginationResponseDto<UserEntity>> {
    const sort = getSort(query, 'users');
    const data = await getRepository(UserEntity)
      .createQueryBuilder('users')
      .take(+query.limit)
      .skip(+query.page)
      .orderBy(sort, query.order)
      .getManyAndCount();

    return {
      items: data[0],
      count: data[1],
    };
  }

  async getOne(id: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ id });
  }

  async updateOne(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    await this.isUserExist(id);
    await this.validateUsername(updateUserDto.username);
    await this.userRepository.update(id, updateUserDto);
    return updateUserDto;
  }

  async deleteMany(ids: string[]): Promise<{ message: string }> {
    await this.userRepository.delete(ids);
    return {
      message: 'Users deleted successfully!',
    };
  }

  async deleteOne(id: string): Promise<{ message: string }> {
    await this.isUserExist(id);
    await this.userRepository.delete(id);
    return {
      message: 'User deleted successfully!',
    };
  }

  async saveWithoutOptimization(id: string, originalFile: IFile): Promise<any> {
    const { destination, filename, mimetype } = originalFile;
    const imagePath = `${destination}/${filename}`;
    const file = readFileSync(imagePath);

    const loadedOriginalFile: any = await this.fileUploadService.upload(
      file,
      filename,
      mimetype,
    );

    await this.isUserExist(id);
    const result = await this.userRepository
      .createQueryBuilder()
      .update({
        avatar: loadedOriginalFile.Location,
      })
      .where({
        id,
      })
      .returning(['username', 'avatar'])
      .execute();

    return result.raw[0];
  }

  async saveUser(user: UserEntity) {
    await this.userRepository.save(user);
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
    });
  }

  async findByConfirmationToken(
    confirmationToken: string,
  ): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { confirmationToken },
    });
  }

  async generateHashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async updatePassword(userId: string, password: string) {
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
