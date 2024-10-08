import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multer, { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { IFile } from './file.interface';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetCurrentUserId } from '../auth/decorators/get-current-user-id.decorator';
import { SentryInterceptor } from '../sentry/sentry.interceptor';
import {
  UploadUserAvatarDto,
  UploadUserAvatarResponseDto,
  UserEntityDto,
} from './dto/user.dto';
import { UuidParam } from 'src/common/params/uuid.param';

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

//TODO
//continue refactor admin user & user

@ApiTags('Users')
@UseInterceptors(SentryInterceptor)
@Controller('users/')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({ status: 200, type: UserEntityDto })
  @Get('/:id')
  @ApiBearerAuth()
  getOne(@Param() param: UuidParam): Promise<UserEntityDto> {
    return this.userService.getOne(param.id);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, type: UpdateUserDto })
  @Put()
  @ApiBearerAuth()
  updateOne(
    @GetCurrentUserId() userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    return this.userService.updateOne(userId, updateUserDto);
  }

  @ApiOperation({ summary: 'Update user profile picture' })
  @ApiResponse({ status: 200, type: UploadUserAvatarResponseDto })
  @Post('/avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadUserAvatarDto })
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file', storage))
  async updateAvatar(
    @GetCurrentUserId() userId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadUserAvatarResponseDto> {
    return this.userService.saveWithoutOptimization(userId, file);
  }
}
