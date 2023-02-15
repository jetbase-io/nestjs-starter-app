import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'Dr. House', description: 'Title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Episode of Dr. House and his dialogue with his colleague',
    description: 'Description',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: '', description: 'Time for post to be published at' })
  pubslished_at?: Date | null;
}
