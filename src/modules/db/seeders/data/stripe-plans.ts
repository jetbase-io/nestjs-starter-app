import {
  CreateStripePlanDto,
  Interval,
} from 'src/modules/stripe/dto/stripe-plan.dto';

export const stripePlans: CreateStripePlanDto[] = [
  {
    amount: 1000,
    currency: 'usd',
    interval: Interval.Month,
    product: '',
  },
  {
    amount: 5000,
    currency: 'usd',
    interval: Interval.Month,
    product: '',
  },
  {
    amount: 10000,
    currency: 'usd',
    interval: Interval.Month,
    product: '',
  },
];
