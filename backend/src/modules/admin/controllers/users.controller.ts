import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/modules/users/models/users.entity';
import { UsersService } from 'src/modules/users/users.service';
import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { PaginationParams } from '../dto/pagination-params.dto';
import { PaginationResponseDto } from '../dto/pagination-response.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(AdminAuthGuard)
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: 'Get users' })
  @ApiResponse({ status: 200, type: UserEntity })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('')
  getUsers(
    @Query() query: PaginationParams,
  ): Promise<PaginationResponseDto<UserEntity>> {
    return this.userService.getUsers(query);
  }

  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({ status: 200, type: UserEntity })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  getOne(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.getOne(id);
  }

  @ApiOperation({ summary: 'Delete many users' })
  @ApiResponse({ status: 200, description: 'Returns success message' })
  @Delete('delete')
  deleteMany(@Body() { ids }: any): Promise<{ message: string }> {
    return this.userService.deleteMany(ids);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'Returns success message' })
  @Delete(':id')
  deleteOne(@Param('id') id: string): Promise<{ message: string }> {
    return this.userService.deleteOne(id);
  }
}
