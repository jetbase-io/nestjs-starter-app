import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { GetCurrentUserId } from '../../common/decorators/get-current-user-id.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ActivateSubscriptionDto } from './dto/activate-subscription.dto';
import { Public } from '../../common/decorators/public.decorator';
import { SentryInterceptor } from '../../common/interceptors/sentry.interceptor';
import { Request, Response } from 'express';
import { ActivatedSubscriptionResponseDto } from './dto/activated-sub-response.dto';
import {
  DetachMethodBodyDto,
  DetachMethodResponseDto,
  StripePaymentMethodResponseDto,
} from './dto/stripe-payment-method.dto';
import { StripePlanResponseDto } from './dto/stripe-plan.dto';
import { StripeSubscriptionStatusResponseDto } from './dto/stripe-subscription.dto';

@ApiTags('Billing')
@UseInterceptors(SentryInterceptor)
@Controller('billing')
@ApiBearerAuth()
export class StripeController {
  constructor(private stripeService: StripeService) {}

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
}
