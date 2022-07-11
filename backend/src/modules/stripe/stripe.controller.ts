import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { GetCurrentUserId } from '../auth/decorators/get-current-user-id.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ActivateSubscriptionDto } from './dto/activate-subscription.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Billing')
@Controller('api/billing')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @ApiOperation({ summary: 'Activate Subscription' })
  @ApiResponse({ status: 200, description: 'Activates stripe subscription' })
  @Post('/activateSubscription')
  activateSubscription(
    @GetCurrentUserId() userId: number,
    @Body() email: string,
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

  @ApiOperation({ summary: 'Plans' })
  @ApiResponse({ status: 200, description: 'Stripe plans' })
  @Get('/plans')
  getPlans() {
    return this.stripeService.getPlans();
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
  getPaymentMethods(@GetCurrentUserId() userId: number) {
    return this.stripeService.getPaymentMethods(userId);
  }

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
}
