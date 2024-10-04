import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Max } from 'class-validator';

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}
export class PaginationParams {
  @ApiProperty()
  page: string;

  @Max(50)
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
