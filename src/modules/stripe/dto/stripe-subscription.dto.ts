import { ApiProperty } from '@nestjs/swagger';
import Stripe from 'stripe';

const STRIPE_INACTIVE = 'inactive';
export class StripeSubscriptionStatusResponseDto {
  @ApiProperty()
  nickname: string;

  @ApiProperty()
  status: string;

  static invoke(
    data?: Stripe.Response<Stripe.Subscription>,
  ): StripeSubscriptionStatusResponseDto {
    const dto = new StripeSubscriptionStatusResponseDto();

    if (data) {
      const status = data.status;
      const nickname = data.items.data[0]?.price?.nickname;

      dto.nickname = nickname;
      dto.status = status;
    } else {
      dto.nickname = '';
      dto.status = STRIPE_INACTIVE;
    }

    return dto;
  }
}
