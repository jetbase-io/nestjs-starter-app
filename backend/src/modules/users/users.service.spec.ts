import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserEntity } from './models/users.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RolesService } from '../roles/roles.service';
import { RoleEntity } from '../roles/enums/role.enum';

describe('UsersService', () => {
  let userService: UsersService;
  const userRepository: Partial<Repository<UserEntity>> = {
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const fakeRolesService: Partial<RolesService> = {
    getRoleByValue: () =>
      Promise.resolve([{ id: 2, value: 'USER' }] as RoleEntity[]),
  };
  const mockUserEntity = Promise.resolve({
    id: 1,
    username: 'testUsernmae',
    password: 'hashedPassword',
    roles: [{ id: 2, value: 'USER' }],
  } as UserEntity);
  const mockUserDto = {
    username: 'testUsernmae',
    password: 'testPassword',
  };
  const mockUserId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: RolesService,
          useValue: fakeRolesService,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userRepository,
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
    const user = await userService.create(mockUserDto);
    expect(user.roles.length).toBeGreaterThan(0);
  });

  it('return user with provided id', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUserEntity);
    const user = await userService.getOne(mockUserId);
    expect(user.id).toEqual(1);
  });

  it('return user with provided id', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUserEntity);
    const user = await userService.getOne(mockUserId);
    expect(user.id).not.toEqual(2);
  });
});
