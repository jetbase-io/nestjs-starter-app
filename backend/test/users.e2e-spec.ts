import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/modules/users/dto/create-user.dto';
import { useContainer } from 'class-validator';
import {
  initialiseTestTransactions,
  runInTransaction,
} from 'typeorm-test-transactions';
import { UpdateUserDto } from '../src/modules/users/dto/update-user.dto';

initialiseTestTransactions();

describe('Users Controller', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let globalAccessToken;
  let globalRefreshToken;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.init();
  });

  it(
    'returns tokens after sign in as admin',
    runInTransaction(() => {
      const createUserDto: CreateUserDto = {
        username: 'testAdmin',
        email: 'testAdmin@gmail.com',
        password: 'admin123',
      };
      return request(app.getHttpServer())
        .post('/api/auth/signIn')
        .send(createUserDto)
        .expect(201)
        .then((res) => {
          const { accessToken, refreshToken } = res.body;
          globalAccessToken = accessToken;
          globalRefreshToken = refreshToken;
          expect(accessToken).toBeDefined();
          expect(refreshToken).toBeDefined();
        });
    }),
  );

  it(
    'returns 200 Ok create after update',
    runInTransaction(async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'signUp@gmail.com',
      };
      return request(app.getHttpServer())
        .put(`/api/users/${1}`)
        .set('Authorization', `Bearer ${globalAccessToken}`)
        .send(updateUserDto)
        .expect(200)
        .then();
    }),
  );
});
