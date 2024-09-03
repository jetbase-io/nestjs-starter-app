import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { users } from './data/users';
import { stripePlans } from './data/stripe-plans';
import { StripeService } from 'src/modules/stripe/stripe.service';
import { stripeProduct } from './data/stripe-produt';

@Injectable()
export class Seeder {
  constructor(
    private readonly userService: UsersService,
    private readonly stipeService: StripeService,
  ) {}
  async seed() {
    for await (const iterator of users) {
      await this.userService
        .createBySeed(iterator)
        .then((completed) => {
          Promise.resolve(completed);
        })
        .catch((error) => {
          Promise.reject(error);
        });
    }

    await this.stipeService.createDataBySeed(stripeProduct, stripePlans);
  }
}
