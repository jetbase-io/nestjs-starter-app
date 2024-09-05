import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/models/users.entity';
import { UsersModule } from '../users/users.module';
import { AdminController } from './controllers/admin.controller';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { UsersController } from './controllers/users.controller';
import { StripeController } from './controllers/stripe.controller';
import { PostsController } from './controllers/posts.controller';
import { PostsModule } from '../posts/posts.module';
import { PostEntity } from '../posts/models/posts.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthModule } from '../auth/auth.module';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, PostEntity]),
    UsersModule,
    PostsModule,
    AuthModule,
    StripeModule,
  ],
  controllers: [
    AdminController,
    UsersController,
    PostsController,
    AuthController,
    StripeController,
  ],
  providers: [AdminAuthGuard],
})
export class AdminModule {}
