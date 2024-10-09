import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Readable } from 'stream';

describe('UsersController', () => {
  let controller: UsersController;

  const userId = '4b35f168-74ef-44e3-8df9-f7232a408e8a';
  const file = {
    fieldname: 'file',
    originalname: 'profile_pic.png',
    encoding: '7bit',
    mimetype: 'multipart/form-data',
    destination: './uploads/temp',
    filename: 'b0d82301-55bd-4817-913a-889e30176c07.png',
    path: 'uploads/temp/b0d82301-55bd-4817-913a-889e30176c07.png',
    size: 1011131,
    buffer: Buffer.from('one, two'),
    stream: new Readable(),
  };

  const mockUsersService = {
    updateOne: jest.fn(async (id, dto) => {
      return await Promise.resolve({ dto });
    }),
    saveWithoutOptimization: jest.fn(async (id, file) => {
      return await Promise.resolve({
        username: 'newUser',
        avatar:
          'https://company-website-staging.s3.amazonaws.com/889d1c74-2007-4119-983a-4ce83deaac58.png',
      });
    }),
    getOne: jest.fn(async (id) => {
      return await Promise.resolve({
        id: id,
        created_at: '2022-11-11T13:21:28.758Z',
        updated_at: '2022-11-15T06:13:39.170Z',
        internalComment: null,
        username: 'newUser',
        email: 'newUser@gmail.com',
        password:
          '$2a$10$R4AkmrO5UPmtyTcCXWyGTe.db7ulBtMIqhIBXEhDCRkefNy2DwUZO',
        customerStripeId: null,
        subscriptionId: null,
        roles: 'User',
        avatar:
          'https://company-website-staging.s3.amazonaws.com/889d1c74-2007-4119-983a-4ce83deaac58.png',
      });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
      controllers: [UsersController],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a user by id', async () => {
    const data = controller.getOne({ id: userId });
    expect(data).toEqual(
      Promise.resolve({
        id: '4b35f168-74ef-44e3-8df9-f7232a408e8a',
        created_at: '2022-11-11T13:21:28.758Z',
        updated_at: '2022-11-15T06:13:39.170Z',
        internalComment: null,
        username: 'newUser',
        email: 'newUser@gmail.com',
        password:
          '$2a$10$R4AkmrO5UPmtyTcCXWyGTe.db7ulBtMIqhIBXEhDCRkefNy2DwUZO',
        customerStripeId: null,
        subscriptionId: null,
        roles: 'User',
        avatar:
          'https://company-website-staging.s3.amazonaws.com/889d1c74-2007-4119-983a-4ce83deaac58.png',
      }),
    );
  });

  it('should update username and return user entity', async () => {
    const data = controller.updateOne(userId, {
      username: 'benzema',
    });
    expect(data).toEqual(
      Promise.resolve({
        username: 'benzema',
      }),
    );
  });
  it('should update user avatar and return an object with username and avatar', async () => {
    const data = controller.updateAvatar(userId, file);
    expect(data).toEqual(
      Promise.resolve({
        username: 'newUser',
        avatar: expect.any(String),
      }),
    );
  });
});
