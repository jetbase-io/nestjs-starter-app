import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserImageDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'IMG.jpeg',
    description: 'Profile Picture',
    format: 'binary',
  })
  avatar: any;
}
