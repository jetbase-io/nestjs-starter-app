import { MinLength, IsString, IsNotEmpty } from 'class-validator';
import Stripe from 'stripe';
import { StripePriceResponseDto } from './stripe-price.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStripeProductDto {
  @IsNotEmpty()
  @MinLength(1)
  @IsString()
  name: string;
}

export class StripeProductResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  active: boolean;
  @ApiProperty({ nullable: true, isArray: true, type: String })
  attributes: string[] | null;
  @ApiProperty({ nullable: true })
  caption: string | null;
  @ApiProperty()
  created: number;
  @ApiProperty({ required: false, isArray: true, type: String })
  deactivate_on?: string[];
  @ApiProperty({
    nullable: true,
    required: false,
    type: StripePriceResponseDto || 'string',
  })
  default_price?: string | StripePriceResponseDto | null;
  @ApiProperty({ nullable: true })
  description: string | null;
  @ApiProperty({ isArray: true, type: String })
  images: string[];
  @ApiProperty()
  livemode: boolean;
  @ApiProperty()
  name: string;
  @ApiProperty({ nullable: true })
  shippable: boolean | null;
  @ApiProperty({ nullable: true })
  statement_descriptor: string | null;
  @ApiProperty()
  type: string;
  @ApiProperty({ nullable: true })
  unit_label: string | null;
  @ApiProperty()
  updated: number;
  @ApiProperty({ nullable: true })
  url: string | null;

  static fromEntity(entity: Stripe.Product): StripeProductResponseDto {
    const dto = new StripeProductResponseDto();

    dto.id = entity.id;
    dto.active = entity.active;
    dto.attributes = entity.attributes;
    dto.caption = entity.caption;
    dto.created = entity.created;
    dto.deactivate_on = entity.deactivate_on;

    const enDefaultPrice = entity.default_price;
    if (typeof enDefaultPrice !== 'string') {
      const price = StripePriceResponseDto.fromEntity(enDefaultPrice);

      dto.default_price = price;
    } else {
      dto.default_price = enDefaultPrice;
    }

    dto.description = entity.description;
    dto.images = entity.images;
    dto.livemode = entity.livemode;
    dto.name = entity.name;
    dto.shippable = entity.shippable;
    dto.statement_descriptor = entity.statement_descriptor;
    dto.type = entity.type;
    dto.unit_label = entity.unit_label;
    dto.updated = entity.updated;
    dto.url = entity.url;

    return dto;
  }
}
