import { ApiProperty } from '@nestjs/swagger';
import Stripe from 'stripe';

export class ActivatedSubscriptionResponseDto {
  @ApiProperty()
  clientSecret: string;
  @ApiProperty()
  status: Stripe.PaymentIntent.Status;
  @ApiProperty()
  subscriptionId: string;
  @ApiProperty()
  nickname: string;
}
