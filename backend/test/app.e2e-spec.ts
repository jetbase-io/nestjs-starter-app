import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { useContainer } from 'class-validator';
import { clearDB, seed } from './setup';
import {
  initialiseTestTransactions,
  runInTransaction,
} from 'typeorm-test-transactions';

initialiseTestTransactions();

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await clearDB(app);
    await seed();
    await app.init();
  });

  it(
    'returns tokens after sign up',
    runInTransaction(async () => {
      return request(app.getHttpServer()).get('/').expect(401).then();
    }),
  );
});
