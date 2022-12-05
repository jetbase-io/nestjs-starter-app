import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './models/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { FileUploadService } from './fileupload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule,
    FileUploadService,
  ],
  controllers: [UsersController],
  providers: [UsersService, FileUploadService],
  exports: [UsersService],
})
export class UsersModule {}
