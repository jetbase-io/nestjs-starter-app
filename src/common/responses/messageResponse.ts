import { ApiProperty } from '@nestjs/swagger';

export class MessageResponse {
  @ApiProperty()
  public message: string;

  constructor(customMessage: string) {
    this.message = customMessage;
  }
}
