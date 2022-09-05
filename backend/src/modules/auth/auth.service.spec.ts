import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenEntity } from './models/refreshTokens.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExpiredAccessTokenEntity } from './models/expiredAccessTokens.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { repositoryMockFactory } from 'src/utils/helpers/mock-repository';
import { randomUUID } from 'crypto';
import { Role } from '../roles/enums/role.enum';
import { ForbiddenException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let refreshTokenRepository;
  let expiredAccessTokenRepository;

  const fakeUserService = {
    getOne: jest.fn(),
    create: jest.fn(),
    validateUsername: jest.fn(),
    findByUsername: jest.fn(),
    isPasswordValid: jest.fn(),
  };

  const mockUserId = randomUUID();
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
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(RefreshTokenEntity),
          useFactory: repositoryMockFactory,
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
    refreshTokenRepository = module.get(getRepositoryToken(RefreshTokenEntity));
    expiredAccessTokenRepository = module.get(
      getRepositoryToken(ExpiredAccessTokenEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns access and refresh token after sign up', async () => {
    fakeUserService.create.mockImplementationOnce(
      async (userDto: CreateUserDto) => {
        expect(userDto).toEqual({
          username: mockUsername,
          password: mockPassword,
        });
        return {
          id: mockUserId,
          roles: Role.USER,
          username: mockUsername,
          password: mockPassword,
        };
      },
    );

    const tokens = await service.signUp({
      username: mockUsername,
      password: mockPassword,
    } as CreateUserDto);

    expect(tokens.refreshToken).toBeDefined();
    expect(tokens.accessToken).toBeDefined();
  });

  it('returns access and refresh token after sign in', async () => {
    fakeUserService.findByUsername.mockImplementationOnce(
      async (username: string) => {
        expect(username).toBe(mockUsername);
        return {
          id: mockUserId,
          roles: Role.USER,
          username: mockUsername,
          password: mockPassword,
        };
      },
    );

    fakeUserService.isPasswordValid.mockImplementationOnce(
      async (password, user) => {
        expect(password).toBe(mockPassword);
        return !!user;
      },
    );

    const tokens = await service.signIn({
      username: mockUsername,
      password: mockPassword,
    } as CreateUserDto);

    expect(tokens.refreshToken).toBeDefined();
    expect(tokens.accessToken).toBeDefined();
  });

  it('returns success message after logout', async () => {
    const mockFoundToken = {};
    refreshTokenRepository.findOne.mockImplementationOnce(
      async ({
        where: {
          user: { id },
          token,
        },
      }) => {
        expect(id).toBe(mockUserId);
        expect(token).toBe(mockRefreshToken);

        return mockFoundToken;
      },
    );
    refreshTokenRepository.remove.mockImplementationOnce(async (foundToken) => {
      expect(foundToken).toBe(mockFoundToken);
    });

    const message = await service.signOut(
      mockUserId,
      mockAccessToken,
      mockRefreshToken,
    );

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
    const mockFoundToken = {};
    refreshTokenRepository.findOne.mockImplementationOnce(
      async ({
        where: {
          user: { id },
          token,
        },
      }) => {
        expect(id).toBe(mockUserId);
        expect(token).toBe(mockRefreshToken);

        return mockFoundToken;
      },
    );
    refreshTokenRepository.remove.mockImplementationOnce(async (foundToken) => {
      expect(foundToken).toBe(mockFoundToken);
    });

    fakeUserService.getOne.mockImplementationOnce(async (id: string) => {
      expect(id).toBe(mockUserId);
      return {
        id: mockUserId,
        roles: Role.USER,
        username: mockUsername,
        password: mockPassword,
      };
    });

    expiredAccessTokenRepository.findOne.mockImplementationOnce(async () => ({
      id: mockUserId,
      token: mockRefreshToken,
    }));

    const tokens = await service.refreshAccessToken(
      mockUserId,
      mockRefreshToken,
    );

    expect(tokens.refreshToken).toBeDefined();
    expect(tokens.accessToken).toBeDefined();
  });

  it('returns ForbiddenException if username not found', async () => {
    fakeUserService.findByUsername.mockResolvedValueOnce(undefined);

    await expect(
      service.validateUser(mockUsername, mockPassword),
    ).rejects.toThrow(ForbiddenException);
  });

  it('returns UnauthorizedException if passwordInvalid', async () => {
    fakeUserService.isPasswordValid.mockResolvedValueOnce(undefined);

    await expect(
      service.validateUser(mockUsername, mockPassword),
    ).rejects.toThrow(ForbiddenException);
  });

  it('returns false if token not expired', async () => {
    expiredAccessTokenRepository.findOne.mockResolvedValueOnce(undefined);

    const result = await service.isAccessTokenExpired(
      mockUserId,
      mockAccessToken,
    );
    expect(result).toEqual(false);
  });

  it('returns true if token expired', async () => {
    expiredAccessTokenRepository.findOne.mockResolvedValueOnce({
      id: mockUserId,
      token: mockAccessToken,
    } as ExpiredAccessTokenEntity);

    const result = await service.isAccessTokenExpired(
      mockUserId,
      mockAccessToken,
    );
    expect(result).toBe(true);
  });
});
