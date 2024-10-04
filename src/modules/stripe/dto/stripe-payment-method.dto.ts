import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import Stripe from 'stripe';

export class DetachMethodBodyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  paymentMethodId: string;
}

export class DetachMethodResponseDto {
  @ApiProperty()
  id: string;
}

export class StripeCardResponseDto {
  @ApiProperty()
  brand: string;
  @ApiProperty({ nullable: true })
  country: string | null;
  @ApiProperty({ required: false, nullable: true })
  description?: string | null;
  @ApiProperty()
  exp_month: number;
  @ApiProperty()
  exp_year: number;
  @ApiProperty()
  funding: string;
  @ApiProperty()
  last4: string;

  static fromEntity(entity: Stripe.PaymentMethod.Card): StripeCardResponseDto {
    const dto = new StripeCardResponseDto();

    dto.brand = entity.brand;
    dto.country = entity.country;
    dto.description = entity.description;
    dto.exp_month = entity.exp_month;
    dto.exp_year = entity.exp_year;
    dto.funding = entity.funding;
    dto.last4 = entity.last4;

    return dto;
  }
}

export class StripePaymentMethodResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty({ required: false, type: StripeCardResponseDto })
  card?: StripeCardResponseDto;
  @ApiProperty()
  created: number;
  @ApiProperty()
  livemode: boolean;
  @ApiProperty()
  type: string;

  static fromEntity(
    entity: Stripe.PaymentMethod,
  ): StripePaymentMethodResponseDto {
    const dto = new StripePaymentMethodResponseDto();

    dto.id = entity.id;

    if (dto.card) {
      dto.card = StripeCardResponseDto.fromEntity(entity.card);
    } else {
      dto.card = entity.card;
    }

    dto.created = entity.created;
    dto.livemode = entity.livemode;
    dto.type = entity.type;
    return dto;
  }
}
