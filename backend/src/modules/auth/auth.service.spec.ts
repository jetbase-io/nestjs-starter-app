import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/models/users.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { RefreshTokenEntity } from './models/refreshTokens.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExpiredAccessTokenEntity } from './models/expiredAccessTokens.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  const refreshTokenRepo: Partial<Repository<RefreshTokenEntity>> = {
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };
  const expiredAccessTokenRepo: Partial<Repository<ExpiredAccessTokenEntity>> =
    {
      save: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };
  const fakeUserService: Partial<UsersService> = {
    getOne: () =>
      Promise.resolve({
        id: 1,
        username: 'testUser',
        password: 'testPassword',
      } as UserEntity),
    create: (userDto) =>
      Promise.resolve({
        id: 1,
        username: 'testUser',
        password: 'testPassword',
      } as UserEntity),
    validateUsername: (username: string) =>
      Promise.resolve({
        id: 1,
        username,
        password: 'testPassword',
      } as UserEntity),
    findByUsername: (username: string) =>
      Promise.resolve({
        id: 1,
        username,
        password: 'testPassword',
      } as UserEntity),
    isPasswordValid: (password: string, user: UserEntity) =>
      Promise.resolve(true),
  };

  const mockUserDto = Promise.resolve({
    username: 'testUsernmae',
    password: 'testPassword',
  } as CreateUserDto);
  const mockUserId = 1;
  const mockUsername = 'testUsername';
  const mockPassword = 'testPassword123';
  const mockAccessToken = 'f7ewf7e7f7ew9few9';
  const mockRefreshToken = 'd04023f0d0fds0f0s3f4sdf00df';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(ExpiredAccessTokenEntity),
          useValue: expiredAccessTokenRepo,
        },
        {
          provide: getRepositoryToken(RefreshTokenEntity),
          useValue: refreshTokenRepo,
        },
        {
          provide: JwtService,
          useClass: JwtService,
        },
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns access and refresh token after sign up', async () => {
    const tokens = await service.signUp(await mockUserDto);

    expect(tokens.refreshToken).toBeDefined();
    expect(tokens.accessToken).toBeDefined();
  });

  it('returns access and refresh token after sign in', async () => {
    const tokens = await service.signIn(await mockUserDto);

    expect(tokens.refreshToken).toBeDefined();
    expect(tokens.accessToken).toBeDefined();
  });

  it('returns success message after logout', async () => {
    const message = await service.signOut(mockUserId, mockAccessToken);

    expect(message).toEqual({ message: 'Successfully logged out!' });
  });

  it('returns Forbidden Exception if refreshToken not found', async () => {
    try {
      await expect(
        service.refreshAccessToken(mockUserId, mockAccessToken),
      ).rejects.toThrowError(ForbiddenException);
    } catch (e) {
      await expect(e).rejects.toThrowError(ForbiddenException);
    }
  });

  it('returns tokens in refreshToken method', async () => {
    jest.spyOn(refreshTokenRepo, 'findOne').mockResolvedValueOnce(
      Promise.resolve({
        id: mockUserId,
        token: mockRefreshToken,
      } as RefreshTokenEntity),
    );

    const tokens = await service.refreshAccessToken(
      mockUserId,
      mockRefreshToken,
    );

    expect(tokens.refreshToken).toBeDefined();
    expect(tokens.accessToken).toBeDefined();
  });

  it('returns UnauthorizedException if username not found', async () => {
    jest
      .spyOn(fakeUserService, 'findByUsername')
      .mockResolvedValueOnce(undefined);

    try {
      await expect(
        service.validateUser(mockUsername, mockPassword),
      ).rejects.toThrowError(UnauthorizedException);
    } catch (e) {
      await expect(e).rejects.toThrowError(UnauthorizedException);
    }
  });

  it('returns UnauthorizedException if passwordInvalid', async () => {
    jest.spyOn(fakeUserService, 'isPasswordValid').mockResolvedValueOnce(false);

    try {
      await expect(
        service.validateUser(mockUsername, mockPassword),
      ).rejects.toThrowError(UnauthorizedException);
    } catch (e) {
      await expect(e).rejects.toThrowError(UnauthorizedException);
    }
  });

  it('returns false if token not expired', async () => {
    jest
      .spyOn(expiredAccessTokenRepo, 'findOne')
      .mockResolvedValueOnce(undefined);

    const result = await service.isAccessTokenExpired(
      mockUserId,
      mockAccessToken,
    );
    expect(result).toEqual(false);
  });

  it('returns true if token expired', async () => {
    jest.spyOn(expiredAccessTokenRepo, 'findOne').mockResolvedValueOnce(
      Promise.resolve({
        id: mockUserId,
        token: mockAccessToken,
      } as ExpiredAccessTokenEntity),
    );

    const result = await service.isAccessTokenExpired(
      mockUserId,
      mockAccessToken,
    );
    expect(result).toEqual(true);
  });
});
