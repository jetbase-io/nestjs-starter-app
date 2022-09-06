import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'src/utils/helpers/mock-repository';
import { UserEntity } from '../users/models/users.entity';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ExpiredAccessTokenEntity } from './models/expiredAccessTokens.entity';
import { RefreshTokenEntity } from './models/refreshTokens.entity';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(ExpiredAccessTokenEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(RefreshTokenEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: repositoryMockFactory,
        },
        JwtService,
        UsersService,
        AuthService,
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
