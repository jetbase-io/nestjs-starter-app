import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterModule } from '@nestjs/core';
import { UserEntity } from '../users/models/users.entity';
import { UsersModule } from '../users/users.module';
import { AdminController } from './controllers/admin.controller';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { UsersController } from './controllers/users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    UsersModule,
    // RouterModule.register([
    //   {
    //     path: 'users',
    //     module: UsersModule,
    //   },
    // ]),
  ],
  controllers: [AdminController, UsersController],
  providers: [AdminAuthGuard],
})
export class AdminModule {}
