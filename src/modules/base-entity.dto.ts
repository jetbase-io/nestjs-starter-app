import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';

export class BaseEntityDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: Date })
  created_at: Date;

  @ApiProperty({ type: Date })
  updated_at: Date;

  static fromEntity(entity: BaseEntity): BaseEntityDto {
    const dto = new BaseEntityDto();
    dto.id = entity.id;
    dto.created_at = entity.created_at;
    dto.updated_at = entity.updated_at;

    return dto;
  }
}
