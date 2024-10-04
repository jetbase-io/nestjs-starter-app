import {
  IsInt,
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import Stripe from 'stripe';

export enum Interval {
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
}

export class CreateStripePlanDto {
  @ApiProperty({ example: 1200, description: 'The amount to be charged.' })
  @IsInt()
  @Min(0)
  amount: number;

  @ApiProperty({
    example: 'usd',
    description: 'The currency in which the amount will be charged.',
  })
  @IsString()
  currency: string;

  @ApiProperty({
    example: 'month',
    description: 'The billing interval for the subscription.',
  })
  @IsEnum(Interval, {
    message: 'Interval must be one of the following: day, week, month, year',
  })
  interval: Interval;

  @ApiProperty({
    example: 'prod_NjpI7DbZx6AlWQ',
    description: 'The ID of the product to be subscribed to.',
  })
  @IsString()
  product: string;

  @ApiPropertyOptional({
    example: true,
    description:
      'Whether the plan is currently available for new subscriptions.',
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({
    example: 1,
    description: 'The number of intervals between subscription billings.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  interval_count?: number;

  @ApiPropertyOptional({
    example: 'per_unit',
    description: 'Describes how to compute the price per period.',
  })
  @IsOptional()
  @IsEnum(['per_unit', 'tiered'])
  billing_scheme?: 'per_unit' | 'tiered';

  @ApiPropertyOptional({
    example: 14,
    description:
      'Default number of trial days when subscribing a customer to this plan.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  trial_period_days?: number;

  @ApiPropertyOptional({
    example: 'licensed',
    description: 'Configures how the quantity per period should be determined.',
  })
  @IsOptional()
  @IsEnum(['metered', 'licensed'])
  usage_type?: 'metered' | 'licensed';
}

export class StripePlanResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty({ nullable: true })
  aggregate_usage: string | null;

  @ApiProperty({ nullable: true })
  amount: number | null;

  @ApiProperty({ nullable: true })
  amount_decimal: string | null;

  @ApiProperty()
  billing_scheme: string;

  @ApiProperty()
  created: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  interval: string;

  @ApiProperty()
  interval_count: number;

  @ApiProperty()
  livemode: boolean;

  @ApiProperty({ nullable: true })
  nickname: string | null;

  @ApiProperty({ nullable: true })
  trial_period_days: number | null;

  @ApiProperty()
  usage_type: string;

  static fromEntity(entity: Stripe.Plan) {
    const dto = new StripePlanResponseDto();

    dto.id = entity.id;
    dto.active = entity.active;
    dto.aggregate_usage = entity.aggregate_usage;
    dto.amount = entity.amount;
    dto.amount_decimal = entity.amount_decimal;
    dto.billing_scheme = entity.billing_scheme;
    dto.created = entity.created;
    dto.currency = entity.currency;
    dto.interval = entity.interval;
    dto.interval_count = entity.interval_count;
    dto.livemode = entity.livemode;
    dto.nickname = entity.nickname;
    dto.trial_period_days = entity.trial_period_days;
    dto.usage_type = entity.usage_type;

    return dto;
  }
}
