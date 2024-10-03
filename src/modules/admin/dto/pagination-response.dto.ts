import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto<T> {
  items: T[];

  @ApiProperty()
  count: number;
}
