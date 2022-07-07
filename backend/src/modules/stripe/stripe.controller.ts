import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
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

  @ApiOperation({ summary: 'Plans' })
  @ApiResponse({ status: 200, description: 'Stripe plans' })
  @Get('/plans')
  getPlans() {
    return this.stripeService.getPlans();
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
