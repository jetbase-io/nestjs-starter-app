import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

async function start() {
  const PORT = process.env.PORT || 3000;
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

  await app.listen(PORT, () => console.log(`server running on port: ${PORT}`));
}

start();
