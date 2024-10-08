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
import {
  PaginatedUsersResponseDto,
  UploadUserAvatarResponseDto,
  UserEntityDto,
} from './dto/user.dto';
import { UserRepository } from './users.repository';
import { MessageResponse } from 'src/common/responses/messageResponse';

@Injectable()
export class UsersService {
  constructor(
    // @InjectRepository(UserEntity)
    // private readonly userRepository: Repository<UserEntity>,
    private readonly newUserRepository: UserRepository,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntityDto> {
    const user = new UserEntity();
    user.username = createUserDto.username;
    user.password = await this.generateHashPassword(createUserDto.password);
    user.email = createUserDto.email;
    user.roles = Role.USER;
    user.confirmationToken = createUserDto.confirmationToken;
    const createdUser = await this.newUserRepository.save(user);

    return UserEntityDto.call(createdUser);
  }

  async createByRole(
    createUserDto: CreateUserByRoleDto,
  ): Promise<UserEntityDto> {
    const user = new UserEntity();
    user.username = createUserDto.username;
    user.password = await this.generateHashPassword(createUserDto.password);
    user.email = createUserDto.email;
    user.roles = createUserDto.role;

    if (createUserDto.confirmedAt) {
      user.confirmedAt = createUserDto.confirmedAt;
    }
    const result = await this.newUserRepository.save(user);

    return UserEntityDto.call(result);
  }

  async getUsers(query: PaginationParams): Promise<PaginatedUsersResponseDto> {
    const sort = getSort(query, 'users');
    const data = await this.newUserRepository.getMany(
      query.page,
      query.limit,
      sort,
      query.order,
    );

    return PaginatedUsersResponseDto.call(data);
  }

  async getOne(id: string): Promise<UserEntityDto> {
    const user = await this.newUserRepository.getOneById(id);

    return UserEntityDto.call(user);
  }

  async updateOne(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    await this.isUserExist(id);
    await this.validateUsername(updateUserDto.username);
    await this.newUserRepository.updateById(id, updateUserDto);
    return updateUserDto;
  }

  async deleteMany(ids: string[]): Promise<MessageResponse> {
    await this.newUserRepository.deleteMany(ids);
    const message = 'Users deleted successfully!';

    return MessageResponse.call(message);
  }

  async deleteOne(id: string): Promise<MessageResponse> {
    await this.isUserExist(id);
    await this.newUserRepository.deleteOne(id);
    const message = 'User deleted successfully!';

    return MessageResponse.call(message);
  }

  async saveWithoutOptimization(
    id: string,
    originalFile: Express.Multer.File,
  ): Promise<UploadUserAvatarResponseDto> {
    const { destination, filename, mimetype } = originalFile;
    const imagePath = `${destination}/${filename}`;
    const file = readFileSync(imagePath);

    const loadedOriginalFile = await this.fileUploadService.upload(
      file,
      filename,
      mimetype,
    );

    await this.isUserExist(id);
    const result = await this.newUserRepository.updateUserAvatarById(
      id,
      loadedOriginalFile?.Location ?? imagePath,
    );

    return UploadUserAvatarResponseDto.call(result);
  }

  async validateUsername(username: string): Promise<void> {
    const user = await this.findByUsername(username);
    if (user) {
      throw new BadRequestException({ message: 'User already exist' });
    }
  }

  async findByUsername(username: string): Promise<UserEntityDto> {
    const res = await this.newUserRepository.getOneByName(username);

    return UserEntityDto.call(res);
  }

  async findByConfirmationToken(
    confirmationToken: string,
  ): Promise<UserEntityDto> {
    const res = await this.newUserRepository.getOneByConfirmationToken(
      confirmationToken,
    );
    return UserEntityDto.call(res);
  }

  async generateHashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async updatePassword(userId: string, password: string): Promise<void> {
    const hashedNewPassword = await this.generateHashPassword(password);
    await this.newUserRepository.updatePassword(userId, hashedNewPassword);
  }

  async isPasswordValid(
    password: string,
    user: UserEntityDto,
  ): Promise<boolean> {
    if (user && user.password) {
      return await bcrypt.compare(password, user.password);
    }
    return false;
  }

  async isUserExist(id: string): Promise<boolean> {
    const user = await this.newUserRepository.getOneById(id);
    if (!user) {
      throw new BadRequestException({
        message: 'User with provided id does not exist!',
      });
    }
    return true;
  }
}
