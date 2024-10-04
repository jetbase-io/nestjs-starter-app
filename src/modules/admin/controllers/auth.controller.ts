import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SentryInterceptor } from '../../../modules/sentry/sentry.interceptor';
import { AuthService } from '../../../modules/auth/auth.service';
import { Public } from '../../../modules/auth/decorators/public.decorator';
import { SignInUserDto } from '../../../modules/users/dto/login-user.dto';
import { GetCurrentUserId } from '../../../modules/auth/decorators/get-current-user-id.decorator';
import { GetCurrentUser } from '../../../modules/auth/decorators/get-current-user.decorator';
import { RefreshTokenAuthGuard } from '../../../modules/auth/guards/refresh-token-auth.guard';
import { RoleCheckInterceptor } from '../interceptors/role-check.interceptor';
import { MessageResponse } from 'src/common/responses/messageResponse';
import { TokensDto } from 'src/common/dto/tokens.dto';
import { SignOutBodyDto } from 'src/modules/auth/dto/signout-body.dtp';

@ApiTags('Auth')
@UseInterceptors(SentryInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign In' })
  @ApiResponse({ status: 200, description: 'Returns tokens', type: TokensDto })
  @Public()
  @UseInterceptors(RoleCheckInterceptor)
  @Post('/signIn')
  signIn(@Body() userDto: SignInUserDto): Promise<TokensDto> {
    return this.authService.signIn(userDto);
  }

  @Post('/signOut')
  @ApiResponse({ type: MessageResponse })
  @ApiBearerAuth()
  signOut(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('accessToken') accessToken: string,
    @Body() body: SignOutBodyDto,
  ): Promise<MessageResponse> {
    return this.authService.signOut(userId, accessToken, body.refreshToken);
  }

  //better to use GET method
  @Public()
  @UseGuards(RefreshTokenAuthGuard)
  @ApiResponse({ status: 200, type: TokensDto })
  @Post('/refresh')
  refreshAccessToken(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<TokensDto> {
    return this.authService.refreshAccessToken(userId, refreshToken);
  }
}
