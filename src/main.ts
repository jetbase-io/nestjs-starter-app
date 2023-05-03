import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import * as Sentry from '@sentry/node';

async function start() {
  const PORT = process.env.PORT || 3000;
  const SENTRY_DSN = process.env.SENTRY_DSN;
  const isDevEnv = process.env.NODE_ENV === 'development';
  const API_DEFAULT_PREFIX = '/api';
  const SWAGGER_PREFIX = '/docs';
  const app = await NestFactory.create(AppModule, { cors: true });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.setGlobalPrefix(API_DEFAULT_PREFIX);

  const config = new DocumentBuilder()
    .setTitle('Nest JS starter')
    .setDescription('Documentation for REST API')
    .setVersion('1.0.0')
    .addTag('MVP Engine')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(API_DEFAULT_PREFIX + SWAGGER_PREFIX, app, document);

  Sentry.init({
    dsn: SENTRY_DSN,
    enabled: !isDevEnv,
  });

  await app.listen(PORT, () => console.log(`server running on port: ${PORT}`));
}

start();
