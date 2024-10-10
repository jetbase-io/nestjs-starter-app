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

  static invoke(
    data: Stripe.Response<Stripe.Subscription>,
  ): ActivatedSubscriptionResponseDto {
    const dto = new ActivatedSubscriptionResponseDto();

    //use "as" because of expand parameter
    const paymentIntent = (data.latest_invoice as Stripe.Invoice)
      .payment_intent as Stripe.PaymentIntent;

    const status = paymentIntent.status;
    const clientSecret = paymentIntent.client_secret;

    //???
    //subscription.items has plans
    //TODO check response
    const nickname = data['plan']['nickname'];

    dto.clientSecret = clientSecret;
    dto.nickname = nickname;
    dto.status = status;
    dto.subscriptionId = data.id;

    return dto;
  }
}
