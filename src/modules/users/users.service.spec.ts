import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { FileUploadService } from './fileupload.service';
import { UserEntity } from './models/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../../common/enums/role.enum';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserByRoleDto } from './dto/create-user-by-role.dto';

describe('UsersService', () => {
  let userService: UsersService;
  const userRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const fileUploadService = {
    upload: async () => {
      return;
    },
    uploadS3: async () => {
      return;
    },
    getS3: () => {
      return;
    },
  };

  const mockUserId = randomUUID();
  const mockUsername = 'testUsername';
  const mockUserEmail = 'testEmail@email.com';
  const mockUserPassword = 'password';
  const mockUserDto: CreateUserDto = {
    username: mockUsername,
    email: mockUserEmail,
    password: mockUserPassword,
  };
  const mockUserWithRoleDto: CreateUserByRoleDto = {
    username: mockUsername,
    email: mockUserEmail,
    password: mockUserPassword,
    role: Role.USER,
  };
  const mockUserEntity = Promise.resolve({
    id: mockUserId,
    username: mockUsername,
    roles: Role.USER,
  } as Partial<UserEntity>);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userRepository,
        },
        {
          provide: FileUploadService,
          useValue: fileUploadService,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('create new user with encoded password', async () => {
    jest.spyOn(userRepository, 'save').mockResolvedValue(mockUserEntity);
    const user = await userService.create(mockUserDto);
    expect(user.password).not.toEqual(mockUserDto.password);
  });

  it('create new user with role', async () => {
    jest.spyOn(userRepository, 'save').mockResolvedValue(mockUserEntity);
    const user = await userService.create(mockUserWithRoleDto);
    expect(user.roles.length).toBeGreaterThan(0);
  });

  it('return user with provided id', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUserEntity);
    const user = await userService.getOne(mockUserId);
    expect(user.id).toEqual(mockUserId);
  });
});
