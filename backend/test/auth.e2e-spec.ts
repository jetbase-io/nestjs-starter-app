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

initialiseTestTransactions();

describe('Authentication System', () => {
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
    'returns tokens after sign up',
    runInTransaction(async () => {
      const createUserDto: CreateUserDto = {
        username: 'signUp@gmail.com',
        password: 'user123',
      };
      return request(app.getHttpServer())
        .post('/api/auth/signUp')
        .send(createUserDto)
        .expect(201)
        .then((res) => {
          const { accessToken, refreshToken } = res.body;
          expect(accessToken).toBeDefined();
          expect(refreshToken).toBeDefined();
        });
    }),
  );

  it(
    'returns tokens after sign up with incorrect username and password',
    runInTransaction(async () => {
      const createUserDto: CreateUserDto = {
        username: 'si',
        password: 'us',
      };
      return request(app.getHttpServer())
        .post('/api/auth/signUp')
        .send(createUserDto)
        .expect(400)
        .then();
    }),
  );

  it(
    'returns tokens after sign in',
    runInTransaction(() => {
      const createUserDto: CreateUserDto = {
        username: 'testuser@gmail.com',
        password: 'user123',
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

  it('returns 401 after sign in with incorrect password', () => {
    const createUserDto: CreateUserDto = {
      username: 'testuser@gmail.com',
      password: 'user123incorrect',
    };
    return request(app.getHttpServer())
      .post('/api/auth/signIn')
      .send(createUserDto)
      .expect(401);
  });

  it(
    'returns success message after after sign out',
    runInTransaction(() => {
      return request(app.getHttpServer())
        .post('/api/auth/signOut')
        .set('Authorization', `Bearer ${globalAccessToken}`)
        .expect(201)
        .then();
    }),
  );
});
