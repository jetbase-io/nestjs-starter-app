import { ApiProperty } from '@nestjs/swagger';

export class StripeSubscriptionStatus {
  @ApiProperty()
  nickname: string;

  @ApiProperty()
  status: string;
}
