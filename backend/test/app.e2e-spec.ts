import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { useContainer } from 'class-validator';
import { clearDB } from './setup';

import * as dotenv from 'dotenv';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    dotenv.config();

    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await clearDB();
    await app.init();
  });

  it("Response status", async () => {
    const res = await request(app.getHttpServer()).get('/');
    expect(res.status).toBe(401);
  });
});
