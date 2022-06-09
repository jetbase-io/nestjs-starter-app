import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './modules/db/db.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AccessTokenAuthGuard } from './modules/auth/guards/access-token-auth.guard';

@Module({
  imports: [
    AuthModule,
    DbModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useExisting: AccessTokenAuthGuard },
    { provide: APP_PIPE, useExisting: ValidationPipe },
    AccessTokenAuthGuard,
    ValidationPipe,
  ],
})
export class AppModule {}
