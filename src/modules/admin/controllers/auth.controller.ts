import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SentryInterceptor } from '../../../modules/sentry/sentry.interceptor';
import { AuthService } from '../../../modules/auth/auth.service';
import { Public } from '../../../modules/auth/decorators/public.decorator';
import { SignInUserDto } from '../../../modules/users/dto/login-user.dto';
import { Tokens } from '../../../modules/auth/types/tokens.type';
import { GetCurrentUserId } from '../../../modules/auth/decorators/get-current-user-id.decorator';
import { GetCurrentUser } from '../../../modules/auth/decorators/get-current-user.decorator';
import { RefreshTokenAuthGuard } from '../../../modules/auth/guards/refresh-token-auth.guard';
import { RoleCheckInterceptor } from '../interceptors/role-check.interceptor';

@ApiTags('Auth')
@UseInterceptors(SentryInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign In' })
  @ApiResponse({ status: 200, description: 'Returns tokens' })
  @Public()
  @UseInterceptors(RoleCheckInterceptor)
  @Post('/signIn')
  signIn(@Body() userDto: SignInUserDto): Promise<Tokens> {
    return this.authService.signIn(userDto);
  }

  @Post('/signOut')
  signOut(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('accessToken') accessToken: string,
    @Body('refreshToken') refreshToken: string,
  ) {
    return this.authService.signOut(userId, accessToken, refreshToken);
  }

  @Public()
  @UseGuards(RefreshTokenAuthGuard)
  @Post('/refresh')
  refreshAccessToken(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshAccessToken(userId, refreshToken);
  }
}
