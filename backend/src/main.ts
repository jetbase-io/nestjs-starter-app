import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AccessTokenAuthGuard } from './modules/auth/guards/access-token-auth.guard';

async function start() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const reflector = new Reflector();
  app.useGlobalGuards(new AccessTokenAuthGuard(reflector));

  const config = new DocumentBuilder()
    .setTitle('Nest JS starter')
    .setDescription('Documentation for REST API')
    .setVersion('1.0.0')
    .addTag('MVP Engine')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(PORT, () => console.log(`server running on port: ${PORT}`));
}

start();
