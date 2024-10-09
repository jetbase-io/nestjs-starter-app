import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityDto } from 'src/common/base/classes/base-entity.dto';
import { PostEntity } from '../models/posts.entity';
import { PaginationResponseDto } from 'src/modules/admin/dto/pagination-response.dto';

export class PostEntityDto extends BaseEntityDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: Date })
  published_at: Date;

  static invoke(entity: PostEntity): PostEntityDto {
    const baseDto = BaseEntityDto.invoke(entity);
    const dto = new PostEntityDto();
    Object.assign(dto, baseDto);
    dto.description = entity.description;
    dto.title = entity.title;
    dto.published_at = entity.published_at;

    return dto;
  }
}

export class PaginatedPostsResponseDto extends PaginationResponseDto<PostEntityDto> {
  static invoke(
    data: [PostEntity[], number],
  ): PaginationResponseDto<PostEntityDto> {
    const userDtos = data[0].map((u) => PostEntityDto.invoke(u));
    const dto = PaginationResponseDto.generateResponse([userDtos, data[1]]);

    return dto;
  }
}
