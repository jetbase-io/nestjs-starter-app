import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { FileUploadService } from '../users/fileupload.service';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { UsersRepositoryBC } from '../users/repository/users.repository.backwardCompability';

describe('StripeController', () => {
  let controller: StripeController;

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
      controllers: [StripeController],
    }).compile();

    controller = module.get<StripeController>(StripeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
