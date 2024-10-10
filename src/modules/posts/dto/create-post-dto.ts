import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

  @IsOptional()
  // @IsDateString()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({
    description: 'Time for post to be published at',
    type: Date,
    nullable: true,
  })
  pubslished_at?: Date | null;
}
