import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/models/users.entity';
import { ActivateSubscriptionDto } from './dto/activate-subscription.dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private readonly usersService: UsersService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2020-08-27',
    });
  }

  async createCustomer(
    user: UserEntity,
    paymentMethod: string,
    email?: string,
  ) {
    if (!user.customerStripeId) {
      const customer = await this.stripe.customers.create({
        payment_method: paymentMethod,
        email: email,
        invoice_settings: {
          default_payment_method: paymentMethod,
        },
      });
      return customer.id;
    }
    await this.stripe.paymentMethods.attach(paymentMethod, {
      customer: user.customerStripeId,
    });
    return user.customerStripeId;
  }

  public async activateSubscription(
    userId: number,
    activateSubscriptionDto: ActivateSubscriptionDto,
  ) {
    const user = await this.usersService.getOne(userId);
    const { paymentMethod, email, priceId } = activateSubscriptionDto;

    const customerId = await this.createCustomer(user, paymentMethod, email);

    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      default_payment_method: paymentMethod,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    });

    const status = subscription['latest_invoice']['payment_intent']['status'];
    const clientSecret =
      subscription['latest_invoice']['payment_intent']['client_secret'];

    return { clientSecret, status };
  }

  public async getPlans() {
    const plans = await this.stripe.plans.list();
    return plans.data.reverse();
  }

  public async webhook(res, req) {
    const event = req.body;
    const customer = event['data']['object']['customer'];
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log(
          `PaymentIntent was successful for customer with id: ${customer}!`,
        );
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        console.log(`PaymentMethod with id: ${paymentMethod.id} is attached`);
        break;
      case ' customer.subscription.created':
        console.log(
          `Customer subscription was created for customer with id: ${customer}`,
        );
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
        return res.status(400).end();
    }

    return res.json({ received: true });
  }
}
