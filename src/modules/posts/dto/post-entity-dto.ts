import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityDto } from 'src/modules/base-entity.dto';
import { PostEntity } from '../models/posts.entity';

export class PostEntityDto extends BaseEntityDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: Date })
  published_at: Date;

  static fromEntity(entity: PostEntity): PostEntityDto {
    const baseDto = BaseEntityDto.fromEntity(entity);
    const dto = new PostEntityDto();
    Object.assign(dto, baseDto);
    dto.description = entity.description;
    dto.title = entity.title;
    dto.published_at = entity.published_at;

    return dto;
  }
}
