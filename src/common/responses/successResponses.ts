import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { MessageResponse } from './messageResponse';
import { PaginationResponseDto } from 'src/modules/admin/dto/pagination-response.dto';

export class SuccessResponseWithBody<T> extends MessageResponse {
  @ApiProperty({ nullable: true })
  public data: T | null;

  constructor(body: T) {
    super('Success');
    this.data = body;
  }
}
export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) =>
  applyDecorators(
    ApiExtraModels(PaginationResponseDto, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationResponseDto) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );
