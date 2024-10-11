import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './models/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { FileUploadService } from './fileupload.service';
import { UsersRepository } from './repository/users.repository';
import { ServiceToken } from 'src/common/enums/diTokens';
import { BcryptService } from './services/bcrypt.service';
import { UserTokens } from 'src/common/enums/userTokens';
import { CreateUserUseCase } from './useCases/create-user.use-case';
import { CreateUserByRoleUseCase } from './useCases/create-user-by-role.use-case';
import { UsersRepositoryBC } from './repository/users.repository.backwardCompability';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule,
    FileUploadService,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    FileUploadService,
    UsersRepository,
    UsersRepositoryBC,
    {
      provide: ServiceToken.BCRYPT_SERVICE,
      useClass: BcryptService,
    },
    {
      provide: UserTokens.CREATE_USER,
      useClass: CreateUserUseCase,
    },
    {
      provide: UserTokens.CREATE_USER_BY_ROLE,
      useClass: CreateUserByRoleUseCase,
    },
  ],
  exports: [UsersService, UsersRepository, UsersRepositoryBC],
})
export class UsersModule {}
