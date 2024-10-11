import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { FileUploadService } from '../users/services/fileupload.service';
import { StripeService } from './stripe.service';
import { UsersRepositoryBC } from '../users/repository/users.repository.backwardCompability';

describe('StripeService', () => {
  let service: StripeService;

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
          provide: UsersRepositoryBC,
          useValue: userRepository,
        },
        UsersService,
        FileUploadService,
        StripeService,
      ],
    }).compile();

    service = module.get<StripeService>(StripeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
