import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StripeService } from '../../stripe/stripe.service';
import { GetCurrentUserId } from '../../../common/decorators/get-current-user-id.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ActivateSubscriptionDto } from 'src/modules/stripe/dto/activate-subscription.dto';
import { SentryInterceptor } from 'src/common/interceptors/sentry.interceptor';
import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import {
  CreateStripePlanDto,
  StripePlanResponseDto,
} from 'src/modules/stripe/dto/stripe-plan.dto';
import {
  CreateStripeProductDto,
  StripeProductResponseDto,
} from 'src/modules/stripe/dto/stripe-product';
import { Request, Response } from 'express';
import { ActivatedSubscriptionResponseDto } from 'src/modules/stripe/dto/activated-sub-response.dto';
import { StripeSubscriptionStatusResponseDto } from 'src/modules/stripe/dto/stripe-subscription.dto';
import {
  DetachMethodBodyDto,
  DetachMethodResponseDto,
  StripePaymentMethodResponseDto,
} from 'src/modules/stripe/dto/stripe-payment-method.dto';

@ApiTags('Billing')
@UseInterceptors(SentryInterceptor)
@Controller('billing')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth()
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Gets notification from stripe events',
  })
  @Public()
  @Post('/webhook')
  webhook(@Res() res: Response, @Req() req: Request) {
    return this.stripeService.webhook(res, req);
  }

  @ApiOperation({ summary: 'Activate Subscription' })
  @ApiResponse({
    status: 200,
    description: 'Activates stripe subscription',
    type: ActivatedSubscriptionResponseDto,
  })
  @Post('/activateSubscription')
  activateSubscription(
    @GetCurrentUserId() userId: string,
    @Body() activateSubscriptionDto: ActivateSubscriptionDto,
  ): Promise<ActivatedSubscriptionResponseDto> {
    return this.stripeService.activateSubscription(
      userId,
      activateSubscriptionDto,
    );
  }

  @ApiOperation({ summary: 'Detach Payment Method' })
  @ApiResponse({
    status: 200,
    description: 'Detach Payment Method from Customer',
    type: DetachMethodResponseDto,
  })
  @Post('/detach')
  detachPaymentMethod(
    @Body() data: DetachMethodBodyDto,
  ): Promise<DetachMethodResponseDto> {
    return this.stripeService.detachPaymentMethod(data.paymentMethodId);
  }

  @ApiOperation({ summary: 'Create plan' })
  @ApiResponse({
    status: 200,
    description: 'Plan created',
    type: StripePlanResponseDto,
  })
  @Post('/plans')
  createPlan(
    @Body() createStripePlanDto: CreateStripePlanDto,
  ): Promise<StripePlanResponseDto> {
    return this.stripeService.createPlan(createStripePlanDto);
  }

  @ApiOperation({ summary: 'Create product' })
  @ApiResponse({
    status: 200,
    description: 'Product created',
    type: StripeProductResponseDto,
  })
  @Post('/products')
  createProduct(
    @Body() createStripeProductDto: CreateStripeProductDto,
  ): Promise<StripeProductResponseDto> {
    return this.stripeService.createProduct(createStripeProductDto);
  }

  @ApiOperation({ summary: 'Plans' })
  @ApiResponse({
    status: 200,
    description: 'Stripe plans',
    type: [StripePlanResponseDto],
  })
  @Get('/plans')
  getPlans(): Promise<StripePlanResponseDto[]> {
    return this.stripeService.getPlans();
  }

  @ApiOperation({ summary: 'Products' })
  @ApiResponse({
    status: 200,
    description: 'Stripe products',
    type: [StripeProductResponseDto],
  })
  @Get('/products')
  getProducts(): Promise<StripeProductResponseDto[]> {
    return this.stripeService.getProducts();
  }

  @ApiOperation({ summary: 'Subscription' })
  @ApiResponse({
    status: 200,
    description: 'Get subscription status',
    type: StripeSubscriptionStatusResponseDto,
  })
  @Get('/subscriptionStatus')
  getSubscriptionStatus(
    @GetCurrentUserId() userId: string,
  ): Promise<StripeSubscriptionStatusResponseDto> {
    return this.stripeService.getSubscriptionStatus(userId);
  }

  @ApiOperation({ summary: 'Payment methods' })
  @ApiResponse({
    status: 200,
    description: 'Stripe payment methods',
    type: [StripePaymentMethodResponseDto],
  })
  @Get('/paymentMethods')
  getPaymentMethods(
    @GetCurrentUserId() userId: string,
  ): Promise<StripePaymentMethodResponseDto[]> {
    return this.stripeService.getPaymentMethods(userId);
  }
}
