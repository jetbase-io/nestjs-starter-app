import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './models/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { FileUploadService } from './services/fileupload.service';
import { UsersRepository } from './repository/users.repository';
import { BaseToken, ServiceToken } from 'src/common/enums/diTokens';
import { BcryptService } from './services/bcrypt.service';
import {
  UserServiceTokens,
  UserUseCaseTokens,
} from 'src/common/enums/userTokens';
import { CreateUserUseCase } from './useCases/create-user.use-case';
import { CreateUserByRoleUseCase } from './useCases/create-user-by-role.use-case';
import { UsersRepositoryBC } from './repository/users.repository.backwardCompability';
import { GetUserByIdUseCase } from './useCases/get-user-by-id.use-case';
import { UpdateUserNameUseCase } from './useCases/update-user-name.use-case';
import { UserPresenter } from './models/users.presenter';
import { UpdateUserAvatarUseCase } from './useCases/update-user-avatar.use-case';
import { DbContext } from '../db/DbContext';

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
      provide: BaseToken.DB_CONTEXT,
      useClass: DbContext,
    },
    {
      provide: ServiceToken.BCRYPT_SERVICE,
      useClass: BcryptService,
    },
    {
      provide: UserUseCaseTokens.CREATE_USER,
      useClass: CreateUserUseCase,
    },
    {
      provide: UserUseCaseTokens.CREATE_USER_BY_ROLE,
      useClass: CreateUserByRoleUseCase,
    },
    {
      provide: UserUseCaseTokens.GET_USER_BY_ID,
      useClass: GetUserByIdUseCase,
    },
    {
      provide: UserUseCaseTokens.UPDATE_USER_NAME,
      useClass: UpdateUserNameUseCase,
    },
    {
      provide: UserUseCaseTokens.UPDATE_USER_AVATAR,
      useClass: UpdateUserAvatarUseCase,
    },
    {
      provide: UserServiceTokens.USER_PRESENTER,
      useClass: UserPresenter,
    },
  ],
  exports: [UsersService, UsersRepository, UsersRepositoryBC],
})
export class UsersModule {}
