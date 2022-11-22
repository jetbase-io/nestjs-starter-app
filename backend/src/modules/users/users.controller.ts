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
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { IFile } from './file.interface';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './models/users.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from '../auth/decorators/get-current-user-id.decorator';

const uploadDir = './uploads/temp';

export const storage = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const filename: string = uuidv4();
      const arr = file.originalname.split('.');
      const extension: string = arr[arr.length - 1];
      cb(null, `${filename}.${extension}`);
    },
  }),
};

@ApiTags('Users')
@Controller('users/')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({ status: 200, type: UserEntity })
  @Get('/:id')
  getOne(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.getOne(id);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, type: UpdateUserDto })
  @Put()
  updateOne(
    @GetCurrentUserId() userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    return this.userService.updateOne(userId, updateUserDto);
  }

  @ApiOperation({ summary: 'Update user profile picture' })
  @ApiResponse({ status: 200 })
  @Post('/avatar')
  @UseInterceptors(FileInterceptor('file', storage))
  async updateAvatar(
    @GetCurrentUserId() userId: string,
    @UploadedFile() file: IFile,
  ): Promise<any> {
    return this.userService.saveWithoutOptimization(userId, file);
  }
}
