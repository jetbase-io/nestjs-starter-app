import { Body, Controller, Post, Query, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Tokens } from './types/tokens.type';
import { SignInUserDto } from '../users/dto/login-user.dto';
import { RefreshTokenAuthGuard } from './guards/refresh-token-auth.guard';
import { GetCurrentUserId } from './decorators/get-current-user-id.decorator';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import { Public } from './decorators/public.decorator';
import { ResetPasswordDto } from '../users/dto/reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign Up' })
  @ApiResponse({ status: 200, description: 'Returns tokens' })
  @Public()
  @Post('/signUp')
  signUp(@Body() userDto: CreateUserDto): Promise<object> {
    return this.authService.signUp(userDto);
  }

  @ApiOperation({ summary: 'Sign In' })
  @ApiResponse({ status: 200, description: 'Returns tokens' })
  @Public()
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

  @Post('/fullSignOut')
  fullSignOut(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('accessToken') accessToken: string,
  ) {
    return this.authService.fullSignOut(userId, accessToken);
  }

  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 200, description: 'Returns success message' })
  @Post('/resetPassword')
  resetPassword(
    @GetCurrentUserId() userId: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(userId, resetPasswordDto);
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

  @ApiOperation({ summary: 'Email confirmation' })
  @ApiResponse({ status: 200, description: 'Returns confirmation link' })
  @Public()
  @Get('/confirmation')
  confirmEmail(@Query('confirmation_token') confirmationToken: string) {
    return this.authService.confirmEmail(confirmationToken);
  }
}
