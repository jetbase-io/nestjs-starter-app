import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../modules/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('posts')
export class PostEntity extends BaseEntity {
  @ApiProperty({ example: 'Dr. House', description: 'Title of the post' })
  @Column()
  title: string;

  @ApiProperty({
    example: 'Post about Dr. House',
    description: 'Description of the post',
  })
  @Column()
  description: string;

  @ApiProperty({ example: '', description: 'Time for post to be published at' })
  @Column({ type: 'timestamptz', nullable: true, default: null })
  published_at: Date;
}
