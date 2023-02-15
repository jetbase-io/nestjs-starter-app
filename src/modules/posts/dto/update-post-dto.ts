import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({ example: 'Dr. House', description: 'Title' })
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'Episode of Dr. House and his dialogue with his colleague',
    description: 'Description',
  })
  @IsString()
  description?: string;

  @ApiProperty({ example: '', description: 'Time for post to be published at' })
  published_at?: Date | null;
}
