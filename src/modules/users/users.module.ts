import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './models/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { FileUploadService } from './fileupload.service';
import { UserRepository } from './users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule,
    FileUploadService,
  ],
  controllers: [UsersController],
  providers: [UsersService, FileUploadService, UserRepository],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
