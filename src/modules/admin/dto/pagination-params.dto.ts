import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}
export class PaginationParams {
  @ApiProperty()
  page: string;

  @ApiProperty()
  limit: string;

  @IsOptional()
  @ApiProperty({
    required: false,
  })
  sort?: string;

  @ApiProperty({
    required: false,
    enum: OrderDirection,
  })
  order?: OrderDirection;
}
