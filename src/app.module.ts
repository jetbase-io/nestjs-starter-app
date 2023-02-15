import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './modules/db/db.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD, APP_PIPE, RouterModule } from '@nestjs/core';
import { AccessTokenAuthGuard } from './modules/auth/guards/access-token-auth.guard';
import { UsersModule } from './modules/users/users.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { AdminModule } from './modules/admin/admin.module';
import { EmailModule } from './modules/emails/emails.module';
import { PostsModule } from './modules/posts/posts.module';

@Module({
  imports: [
    AdminModule,
    AuthModule,
    EmailModule,
    DbModule,
    UsersModule,
    PostsModule,
    StripeModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
      },
    ]),
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
