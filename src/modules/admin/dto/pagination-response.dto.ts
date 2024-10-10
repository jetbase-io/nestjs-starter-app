import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto<T> {
  items: T[];

  @ApiProperty()
  count: number;

  static generateResponse<T>(data: [T[], number]): PaginationResponseDto<T> {
    const dto = new PaginationResponseDto<T>();

    dto.items = data[0];
    dto.count = data[1];

    return dto;
  }
}
