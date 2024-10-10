import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max } from 'class-validator';

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}
export class PaginationParams {
  @Transform(({ value }) => +value)
  @ApiProperty()
  @IsNumber()
  page: number;

  @Transform(({ value }) => +value)
  @Max(50)
  @IsNumber()
  @ApiProperty()
  limit: number;

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
