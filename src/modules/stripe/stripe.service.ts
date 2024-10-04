import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/models/users.entity';
import { ActivateSubscriptionDto } from './dto/activate-subscription.dto';
import {
  CreateStripePlanDto,
  StripePlanResponseDto,
} from './dto/stripe-plan.dto';
import {
  CreateStripeProductDto,
  StripeProductResponseDto,
} from './dto/stripe-product';
import { Request, Response } from 'express';
import { ActivatedSubscriptionResponseDto } from './dto/activated-sub-response.dto';
import { StripeSubscriptionStatus } from './dto/stripe-subscription.dto';
import {
  DetachMethodResponseDto,
  StripePaymentMethodResponseDto,
} from './dto/stripe-payment-method.dto';

const STRIPE_INACTIVE = 'inactive';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private readonly usersService: UsersService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2020-08-27',
    });
  }

  async createProduct(
    createStripeProductDto: CreateStripeProductDto,
  ): Promise<StripeProductResponseDto> {
    const res = await this.stripe.products.create(createStripeProductDto);

    return StripeProductResponseDto.fromEntity(res);
  }

  async createPlan(
    createStripePlanDto: CreateStripePlanDto,
  ): Promise<StripePlanResponseDto> {
    const res = await this.stripe.plans.create(createStripePlanDto);

    return StripePlanResponseDto.fromEntity(res);
  }

  async createCustomer(user: UserEntity, paymentMethod: string) {
    if (!user.customerStripeId) {
      const customer = await this.stripe.customers.create({
        name: user.username,
        payment_method: paymentMethod,
        email: user.email,
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

  async createDataBySeed(
    createStripeProductDto: CreateStripeProductDto,
    createStripePlansDto: CreateStripePlanDto[],
  ) {
    const newProduct = await this.createProduct(createStripeProductDto);

    for await (const plan of createStripePlansDto) {
      const planByProductId = { ...plan, product: newProduct.id };
      await this.createPlan(planByProductId)
        .then((completed) => {
          Promise.resolve(completed);
        })
        .catch((error) => {
          Promise.reject(error);
        });
    }
  }

  public async activateSubscription(
    userId: string,
    activateSubscriptionDto: ActivateSubscriptionDto,
  ): Promise<ActivatedSubscriptionResponseDto> {
    const user = await this.usersService.getOne(userId);
    const { paymentMethod, priceId } = activateSubscriptionDto;

    const customerId = await this.createCustomer(user, paymentMethod);
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      default_payment_method: paymentMethod,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    });
    user.customerStripeId = customerId;
    user.subscriptionId = subscription.id;
    await this.usersService.saveUser(user);

    //use "as" because of expand parameter
    const paymentIntent = (subscription.latest_invoice as Stripe.Invoice)
      .payment_intent as Stripe.PaymentIntent;

    const status = paymentIntent.status;
    const clientSecret = paymentIntent.client_secret;

    //???
    //subscription.items has plans
    //TODO check response
    const nickname = subscription['plan']['nickname'];

    return { clientSecret, status, subscriptionId: subscription.id, nickname };
  }

  public async detachPaymentMethod(
    paymentMethodId: string,
  ): Promise<DetachMethodResponseDto> {
    const res = await this.stripe.paymentMethods.detach(paymentMethodId);

    return { id: res.id };
  }

  public async getProducts(): Promise<StripeProductResponseDto[]> {
    const products = await this.stripe.products.list();
    return products.data
      .reverse()
      .map((i) => StripeProductResponseDto.fromEntity(i));
  }

  public async getPlans(): Promise<StripePlanResponseDto[]> {
    const plans = await this.stripe.plans.list();
    return plans.data
      .reverse()
      .map((item) => StripePlanResponseDto.fromEntity(item));
  }

  public async getSubscriptionStatus(
    userId: string,
  ): Promise<StripeSubscriptionStatus> {
    const sub: StripeSubscriptionStatus = {
      nickname: '',
      status: '',
    };
    const user = await this.usersService.getOne(userId);
    if (user.subscriptionId) {
      const currentSubscription = await this.stripe.subscriptions.retrieve(
        user.subscriptionId,
      );
      sub.nickname = currentSubscription.items.data[0].price.nickname;
      sub.status = currentSubscription.status;
      return sub;
    }
    sub.status = STRIPE_INACTIVE;
    return sub;
  }

  public async getPaymentMethods(
    userId: string,
  ): Promise<StripePaymentMethodResponseDto[]> {
    const user = await this.usersService.getOne(userId);
    if (user.customerStripeId) {
      const result = await this.stripe.paymentMethods.list({
        customer: user.customerStripeId,
        type: 'card',
      });
      return result.data.map((i) =>
        StripePaymentMethodResponseDto.fromEntity(i),
      );
    }
    return [];
  }

  public async getSubscriptions(userId: string) {
    const user = await this.usersService.getOne(userId);
    if (user.customerStripeId) {
      const result = await this.stripe.subscriptions.list({
        customer: user.customerStripeId,
      });
      return result.data;
    }
    return [];
  }

  public async webhook(res: Response, req: Request) {
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
