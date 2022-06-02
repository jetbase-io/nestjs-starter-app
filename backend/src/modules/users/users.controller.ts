import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UserEntity } from './models/users.entity';

@Controller('api/users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get(':id')
  getOne(@Param('id') id: number): Promise<UserEntity> {
    return this.userService.getOne(id);
  }

  @Put(':id')
  updateOne(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    return this.userService.updateOne(id, updateUserDto);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: number): Promise<{ message: string }> {
    return this.userService.deleteOne(id);
  }
}
