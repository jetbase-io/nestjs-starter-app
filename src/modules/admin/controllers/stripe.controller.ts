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
import { GetCurrentUserId } from '../../auth/decorators/get-current-user-id.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ActivateSubscriptionDto } from 'src/modules/stripe/dto/activate-subscription.dto';
import { SentryInterceptor } from 'src/modules/sentry/sentry.interceptor';
import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { CreateStripePlanDto } from 'src/modules/stripe/dto/stripe-plan.dto';
import { CreateStripeProductDto } from 'src/modules/stripe/dto/stripe-product';

@ApiTags('Billing')
@UseInterceptors(SentryInterceptor)
@Controller('billing')
@UseGuards(AdminAuthGuard)
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Gets notification fro stripe events',
  })
  @Public()
  @Post('/webhook')
  webhook(@Res() res, @Req() req) {
    return this.stripeService.webhook(res, req);
  }

  @ApiOperation({ summary: 'Activate Subscription' })
  @ApiResponse({ status: 200, description: 'Activates stripe subscription' })
  @Post('/activateSubscription')
  activateSubscription(
    @GetCurrentUserId() userId: string,
    @Body() activateSubscriptionDto: ActivateSubscriptionDto,
  ) {
    return this.stripeService.activateSubscription(
      userId,
      activateSubscriptionDto,
    );
  }

  @ApiOperation({ summary: 'Detach Payment Method' })
  @ApiResponse({
    status: 200,
    description: 'Detach Payment Method from Customer',
  })
  @Post('/detach')
  detachPaymentMethod(@Body() data) {
    return this.stripeService.detachPaymentMethod(data.paymentMethodId);
  }

  @ApiOperation({ summary: 'Create plan' })
  @ApiResponse({ status: 200, description: 'Plan created' })
  @Post('/plans')
  createPlan(@Body() createStripePlanDto: CreateStripePlanDto) {
    return this.stripeService.createPlan(createStripePlanDto);
  }

  @ApiOperation({ summary: 'Create product' })
  @ApiResponse({ status: 200, description: 'Product created' })
  @Post('/products')
  createProduct(@Body() createStripeProductDto: CreateStripeProductDto) {
    return this.stripeService.createProduct(createStripeProductDto);
  }

  @ApiOperation({ summary: 'Plans' })
  @ApiResponse({ status: 200, description: 'Stripe plans' })
  @Get('/plans')
  getPlans() {
    return this.stripeService.getPlans();
  }

  @ApiOperation({ summary: 'Products' })
  @ApiResponse({ status: 200, description: 'Stripe products' })
  @Get('/products')
  getProducts() {
    return this.stripeService.getProducts();
  }

  @ApiOperation({ summary: 'Subscription' })
  @ApiResponse({ status: 200, description: 'Get subscription status' })
  @Get('/subscriptionStatus')
  getSubscriptionStatus(@GetCurrentUserId() userId) {
    return this.stripeService.getSubscriptionStatus(userId);
  }

  @ApiOperation({ summary: 'Payment methods' })
  @ApiResponse({ status: 200, description: 'Stripe plans' })
  @Get('/paymentMethods')
  getPaymentMethods(@GetCurrentUserId() userId: string) {
    return this.stripeService.getPaymentMethods(userId);
  }
}
