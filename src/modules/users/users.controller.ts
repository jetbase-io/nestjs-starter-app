import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Post,
  UseInterceptors,
  UploadedFile,
  Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetCurrentUserId } from '../../common/decorators/get-current-user-id.decorator';
import { SentryInterceptor } from '../../common/interceptors/sentry.interceptor';
import { UploadUserAvatarDto, UserEntityDto } from './dto/user.dto';
import { UuidParam } from 'src/common/params/uuid.param';
import {
  UserServiceTokens,
  UserUseCaseTokens,
} from 'src/common/enums/userTokens';
import { IGetUserByIdUseCase } from './useCases/get-user-by-id.use-case';
import { IUserPresenter } from './models/users.presenter';
import { IUpdateUserNameUseCase } from './useCases/update-user-name.use-case';
import { IUpdateUserAvatarUseCase } from './useCases/update-user-avatar.use-case';

const uploadDir = './uploads/temp';

export const storage = {
  dest: uploadDir,
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(
        // new Error('directory not exists'),
        null,
        uploadDir,
      );
    },
    filename: (req, file, cb) => {
      console.log('filename', file);
      const filename: string = uuidv4();
      const arr = file.originalname.split('.');
      const extension: string = arr[arr.length - 1];
      cb(null, `${filename}.${extension}`);
    },
  }),
};

@ApiTags('Users')
@UseInterceptors(SentryInterceptor)
@Controller('users/')
@ApiBearerAuth()
export class UsersController {
  constructor(
    @Inject(UserUseCaseTokens.GET_USER_BY_ID)
    private readonly _getUserByIdUseCase: IGetUserByIdUseCase,
    @Inject(UserUseCaseTokens.UPDATE_USER_NAME)
    private readonly _updateUserNameUseCase: IUpdateUserNameUseCase,
    @Inject(UserUseCaseTokens.UPDATE_USER_AVATAR)
    private readonly _updateUserAvatarUseCase: IUpdateUserAvatarUseCase,
    @Inject(UserServiceTokens.USER_PRESENTER)
    private readonly _userPresenter: IUserPresenter,
  ) {}

  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({ status: 200, type: UserEntityDto })
  @Get('/:id')
  async getOne(@Param() param: UuidParam): Promise<UserEntityDto> {
    const userModel = await this._getUserByIdUseCase.execute(param.id);

    return this._userPresenter.toResponseDto(userModel);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, type: UserEntityDto })
  @Put()
  async updateOne(
    @GetCurrentUserId() userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntityDto> {
    const userModel = await this._updateUserNameUseCase.execute({
      id: userId,
      data: updateUserDto,
    });

    return this._userPresenter.toResponseDto(userModel);
  }

  @ApiOperation({ summary: 'Update user profile picture' })
  @ApiResponse({ status: 200, type: UserEntityDto })
  @Post('/avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadUserAvatarDto })
  //TODO
  //Add file validation
  @UseInterceptors(FileInterceptor('file', storage))
  async updateAvatar(
    @GetCurrentUserId() userId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserEntityDto> {
    const userModel = await this._updateUserAvatarUseCase.execute({
      id: userId,
      data: file,
    });

    return this._userPresenter.toResponseDto(userModel);
  }
}
