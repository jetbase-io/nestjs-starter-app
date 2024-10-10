import { ApiProperty } from '@nestjs/swagger';
import Stripe from 'stripe';

export class CustomUnitAmountDto {
  @ApiProperty()
  maximum: number | null;

  @ApiProperty()
  minimum: number | null;

  @ApiProperty()
  preset: number | null;

  static invoke(entity: Stripe.Price.CustomUnitAmount): CustomUnitAmountDto {
    const dto = new CustomUnitAmountDto();

    dto.maximum = entity?.maximum;
    dto.minimum = entity?.minimum;
    dto.preset = entity?.preset;

    return dto;
  }
}

export class StripePriceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  billing_scheme: string;

  @ApiProperty()
  created: number;

  @ApiProperty()
  currency: string;

  @ApiProperty({ type: CustomUnitAmountDto, nullable: true })
  custom_unit_amount: CustomUnitAmountDto | null;

  @ApiProperty()
  livemode: boolean;

  @ApiProperty({ nullable: true })
  lookup_key: string | null;

  @ApiProperty({ nullable: true })
  nickname: string | null;

  @ApiProperty()
  type: string;

  @ApiProperty({ nullable: true })
  unit_amount: number | null;

  @ApiProperty({ nullable: true })
  unit_amount_decimal: string | null;

  static invoke(entity: Stripe.Price): StripePriceResponseDto {
    const dto = new StripePriceResponseDto();

    dto.id = entity.id;
    dto.active = entity.active;
    dto.billing_scheme = entity.billing_scheme;
    dto.created = entity.created;
    dto.currency = entity.currency;

    const entityUnit = entity.custom_unit_amount;

    if (entityUnit) {
      const unit = CustomUnitAmountDto.invoke(entityUnit);
      dto.custom_unit_amount = unit;
    } else {
      dto.custom_unit_amount = null;
    }

    dto.livemode = entity.livemode;
    dto.lookup_key = entity.lookup_key;
    dto.nickname = entity.nickname;
    dto.type = entity.type;
    dto.unit_amount = entity.unit_amount;
    dto.unit_amount_decimal = entity.unit_amount_decimal;

    return dto;
  }
}
