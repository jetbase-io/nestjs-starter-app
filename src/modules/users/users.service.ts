import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserByRoleDto } from './dto/create-user-by-role.dto';
import { Role } from '../../common/enums/role.enum';
import { PaginationParams } from '../admin/dto/pagination-params.dto';
import { getSort } from '../../utils/helpers/get-sort';
import { FileUploadService } from './fileupload.service';
import { readFileSync } from 'fs';
import {
  PaginatedUsersResponseDto,
  UploadUserAvatarResponseDto,
  UserEntityDto,
} from './dto/user.dto';
import { MessageResponse } from 'src/common/responses/messageResponse';
import { UsersRepositoryBC } from './repository/users.repository.backwardCompability';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepositoryBC,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntityDto> {
    const hashedPassword = await this.generateHashPassword(
      createUserDto.password,
    );

    const userRole = Role.USER;

    const createdUser = await this.userRepository.createUser(
      createUserDto,
      userRole,
      hashedPassword,
    );

    return UserEntityDto.invoke(createdUser);
  }

  async createByRole(
    createUserDto: CreateUserByRoleDto,
  ): Promise<UserEntityDto> {
    const hashedPassword = await this.generateHashPassword(
      createUserDto.password,
    );

    const userRole = createUserDto.role;

    const createdUser = await this.userRepository.createUser(
      createUserDto,
      userRole,
      hashedPassword,
      createUserDto.confirmedAt,
    );

    return UserEntityDto.invoke(createdUser);
  }

  async getUsers(query: PaginationParams): Promise<PaginatedUsersResponseDto> {
    const sort = getSort(query, 'users');
    const data = await this.userRepository.getMany(
      query.page,
      query.limit,
      sort,
      query.order,
    );

    return PaginatedUsersResponseDto.invoke(data);
  }

  async getOne(id: string): Promise<UserEntityDto> {
    const user = await this.userRepository.getOneById(id);

    return UserEntityDto.invoke(user);
  }

  async updateOne(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    await this.isUserExist(id);
    await this.validateUsername(updateUserDto.username);
    await this.userRepository.updateById(id, updateUserDto);
    return updateUserDto;
  }

  async deleteMany(ids: string[]): Promise<MessageResponse> {
    await this.userRepository.deleteMany(ids);
    const message = 'Users deleted successfully!';

    return MessageResponse.invoke(message);
  }

  async deleteOne(id: string): Promise<MessageResponse> {
    await this.isUserExist(id);
    await this.userRepository.deleteOne(id);
    const message = 'User deleted successfully!';

    return MessageResponse.invoke(message);
  }

  //TODO
  //Change method after amazon s3 credentials provided
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
    const result = await this.userRepository.updateUserAvatarById(
      id,
      loadedOriginalFile?.Location ?? imagePath,
    );

    return UploadUserAvatarResponseDto.invoke(result);
  }

  async validateUsername(username: string): Promise<void> {
    const user = await this.findByUsername(username);
    if (user) {
      throw new BadRequestException({ message: 'User already exist' });
    }
  }

  async findByUsername(username: string): Promise<UserEntityDto> {
    const res = await this.userRepository.getOneByName(username);

    return UserEntityDto.invoke(res);
  }

  async findByConfirmationToken(
    confirmationToken: string,
  ): Promise<UserEntityDto> {
    const res = await this.userRepository.getOneByConfirmationToken(
      confirmationToken,
    );

    return UserEntityDto.invoke(res);
  }

  //TODO
  //should be moved to the utils
  async generateHashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async updatePassword(userId: string, password: string): Promise<void> {
    const hashedNewPassword = await this.generateHashPassword(password);
    await this.userRepository.updatePassword(userId, hashedNewPassword);
  }

  //TODO
  //should be moved to the utils
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
    const user = await this.userRepository.getOneById(id);
    if (!user) {
      throw new BadRequestException({
        message: 'User with provided id does not exist!',
      });
    }
    return true;
  }
}
