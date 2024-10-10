import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import * as Sentry from '@sentry/node';
import * as dotenv from 'dotenv';
import {
  DEFAULT_LOCAL_PORT,
  DEFAULT_SENTRY_DSN,
  NODE_ENV,
  API_DEFAULT_PREFIX,
  SWAGGER_PREFIX,
  NEST_CONFIGS,
  HTTPS_PATTERN,
} from './configs/constants';

dotenv.config();

async function start() {
  const PORT = process.env.PORT || DEFAULT_LOCAL_PORT;
  const SENTRY_DSN = process.env.SENTRY_DSN || DEFAULT_SENTRY_DSN;
  const isDevEnv = process.env.NODE_ENV === NODE_ENV.DEVELOPMENT;

  const app = await NestFactory.create(AppModule, { cors: true });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.setGlobalPrefix(API_DEFAULT_PREFIX);

  const config = new DocumentBuilder()
    .setTitle(NEST_CONFIGS.TITLE)
    .setDescription(NEST_CONFIGS.DESCRIPTION)
    .setVersion(NEST_CONFIGS.VERSION)
    .addTag(NEST_CONFIGS.TAG)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(API_DEFAULT_PREFIX + SWAGGER_PREFIX, app, document);

  Sentry.init({
    dsn: SENTRY_DSN !== HTTPS_PATTERN ? SENTRY_DSN : DEFAULT_SENTRY_DSN,
    enabled: !isDevEnv && SENTRY_DSN !== HTTPS_PATTERN,
  });

  await app.listen(PORT, () => console.log(`server running on port: ${PORT}`));
}

start();
