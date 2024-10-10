import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'src/utils/helpers/mock-repository';
import { UserEntity } from '../users/models/users.entity';
import { UsersService } from '../users/users.service';
import { FileUploadService } from '../users/fileupload.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ExpiredAccessTokenEntity } from './models/expiredAccessTokens.entity';
import { RefreshTokenEntity } from './models/refreshTokens.entity';
import { EmailService } from '../emails/emails.service';
import { UsersRepository } from '../users/repository/users.repository';

describe('AuthController', () => {
  let controller: AuthController;

  const fakeEmailService = {
    sendContactForm: async () => {
      return;
    },
  };

  const userRepository = {
    getOneById: jest.fn(),
    getOneByName: jest.fn(),
    save: jest.fn(),
    createUser: jest.fn(),
  };

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
          provide: UsersRepository,
          useValue: userRepository,
        },
        JwtService,
        UsersService,
        FileUploadService,
        EmailService,
        AuthService,
      ],
      controllers: [AuthController],
    })
      .overrideProvider(EmailService)
      .useValue(fakeEmailService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
