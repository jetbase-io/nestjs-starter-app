import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './models/users.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('api/users/')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: 'Get users' })
  @ApiResponse({ status: 200, type: UserEntity })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Header('Access-Control-Expose-Headers', 'Content-range')
  @Header('Content-range', '0-5/10')
  @Get('/')
  getUsers(): Promise<UserEntity[]> {
    return this.userService.getUsers();
  }

  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({ status: 200, type: UserEntity })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get('/:id')
  getOne(@Param('id') id: number): Promise<UserEntity> {
    return this.userService.getOne(id);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, type: UpdateUserDto })
  @Put('/:id')
  updateOne(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    return this.userService.updateOne(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'Returns success message' })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Delete(':id')
  deleteOne(@Param('id') id: number): Promise<{ message: string }> {
    return this.userService.deleteOne(id);
  }
}
