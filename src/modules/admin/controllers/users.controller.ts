import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from '../../../modules/users/models/users.entity';
import { UsersService } from '../../../modules/users/users.service';
import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { PaginationParams } from '../dto/pagination-params.dto';
import { PaginationResponseDto } from '../dto/pagination-response.dto';
import { UpdateUserDto } from '../../../modules/users/dto/update-user.dto';
import { SentryInterceptor } from '../../../modules/sentry/sentry.interceptor';
import { CreateUserDto } from '../../../modules/users/dto/create-user.dto';
import { MessageResponse } from 'src/common/responses/messageResponse';
import { UserEntityDto } from 'src/modules/users/dto/user.dto';
import { ApiOkResponsePaginated } from 'src/common/responses/successResponses';

@ApiTags('Users')
@UseInterceptors(SentryInterceptor)
@Controller('users')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 200, type: UserEntityDto })
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserEntityDto> {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get users' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOkResponsePaginated(UserEntityDto)
  getUsers(
    @Query() query: PaginationParams,
  ): Promise<PaginationResponseDto<UserEntityDto>> {
    return this.userService.getUsers(query);
  }

  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({ status: 200, type: UserEntityDto })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  getOne(@Param('id') id: string): Promise<UserEntityDto> {
    return this.userService.getOne(id);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, type: UserEntity })
  @UseInterceptors(ClassSerializerInterceptor)
  @Put('/:id')
  updateOne(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    return this.userService.updateOne(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete many users' })
  @ApiResponse({
    status: 200,
    description: 'Returns success message',
    type: MessageResponse,
  })
  @Delete('delete')
  deleteMany(@Body() { ids }: any): Promise<MessageResponse> {
    return this.userService.deleteMany(ids);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
    status: 200,
    description: 'Returns success message',
    type: MessageResponse,
  })
  @Delete(':id')
  deleteOne(@Param('id') id: string): Promise<MessageResponse> {
    return this.userService.deleteOne(id);
  }
}
