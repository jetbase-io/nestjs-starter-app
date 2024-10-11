import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/models/users.entity';
import { ActivateSubscriptionDto } from './dto/activate-subscription.dto';
import {
  CreateStripePlanDto,
  GetStripePlansResponseDto,
  StripePlanResponseDto,
} from './dto/stripe-plan.dto';
import {
  CreateStripeProductDto,
  GetStripeProductsResponseDto,
  StripeProductResponseDto,
} from './dto/stripe-product';
import { Request, Response } from 'express';
import { ActivatedSubscriptionResponseDto } from './dto/activated-sub-response.dto';
import { StripeSubscriptionStatusResponseDto } from './dto/stripe-subscription.dto';
import {
  DetachMethodResponseDto,
  GetStripePaymentMethodsResponseDto,
  StripePaymentMethodResponseDto,
} from './dto/stripe-payment-method.dto';
import { UsersRepositoryBC } from '../users/repository/users.repository.backwardCompability';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private readonly usersService: UsersService,
    private readonly usersRepository: UsersRepositoryBC,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2020-08-27',
    });
  }

  async createProduct(
    createStripeProductDto: CreateStripeProductDto,
  ): Promise<StripeProductResponseDto> {
    const res = await this.stripe.products.create(createStripeProductDto);

    return StripeProductResponseDto.invoke(res);
  }

  async createPlan(
    createStripePlanDto: CreateStripePlanDto,
  ): Promise<StripePlanResponseDto> {
    const res = await this.stripe.plans.create(createStripePlanDto);

    return StripePlanResponseDto.invoke(res);
  }

  private async createCustomer(
    username: string,
    email: string,
    paymentMethod: string,
  ): Promise<Stripe.Response<Stripe.Customer>> {
    const customer = await this.stripe.customers.create({
      name: username,
      payment_method: paymentMethod,
      email: email,
      invoice_settings: {
        default_payment_method: paymentMethod,
      },
    });

    return customer;
  }

  private async getOrCreateCustomerId(user: UserEntity, paymentMethod: string) {
    if (!user.customerStripeId) {
      const customer = await this.createCustomer(
        user.username,
        user.email,
        paymentMethod,
      );
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
  ): Promise<void> {
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
    const user = await this.usersRepository.getOneById(userId);

    const { paymentMethod, priceId } = activateSubscriptionDto;

    const customerId = await this.getOrCreateCustomerId(user, paymentMethod);

    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      default_payment_method: paymentMethod,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    });

    await this.usersRepository.updateUserStripeInfo(
      user.id,
      customerId,
      subscription.id,
    );

    return ActivatedSubscriptionResponseDto.invoke(subscription);
  }

  public async detachPaymentMethod(
    paymentMethodId: string,
  ): Promise<DetachMethodResponseDto> {
    const res = await this.stripe.paymentMethods.detach(paymentMethodId);

    return DetachMethodResponseDto.invoke(res);
  }

  public async getProducts(): Promise<StripeProductResponseDto[]> {
    const products = await this.stripe.products.list();
    return GetStripeProductsResponseDto.invoke(products);
  }

  public async getPlans(): Promise<StripePlanResponseDto[]> {
    const plans = await this.stripe.plans.list();
    return GetStripePlansResponseDto.invoke(plans);
  }

  public async getSubscriptionStatus(
    userId: string,
  ): Promise<StripeSubscriptionStatusResponseDto> {
    const user = await this.usersService.getOne(userId);

    if (!user.subscriptionId) {
      return StripeSubscriptionStatusResponseDto.invoke();
    }

    const currentSubscription = await this.stripe.subscriptions.retrieve(
      user.subscriptionId,
    );

    return StripeSubscriptionStatusResponseDto.invoke(currentSubscription);
  }

  public async getPaymentMethods(
    userId: string,
  ): Promise<StripePaymentMethodResponseDto[]> {
    const user = await this.usersService.getOne(userId);

    if (!user.customerStripeId) {
      return GetStripePaymentMethodsResponseDto.invoke();
    }

    const result = await this.stripe.paymentMethods.list({
      customer: user.customerStripeId,
      type: 'card',
    });

    return GetStripePaymentMethodsResponseDto.invoke(result);
  }

  //TODO
  //Review unnecessary method
  public async getSubscriptions(userId: string) {
    const user = await this.usersService.getOne(userId);

    if (user.customerStripeId) {
      return [];
    }

    const result = await this.stripe.subscriptions.list({
      customer: user.customerStripeId,
    });

    return result.data;
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
