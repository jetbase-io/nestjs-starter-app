import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  Req,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SignInUserDto } from '../users/dto/login-user.dto';
import { RefreshTokenAuthGuard } from './guards/refresh-token-auth.guard';
import { GetCurrentUserId } from './decorators/get-current-user-id.decorator';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import { Public } from './decorators/public.decorator';
import { ResetPasswordDto } from '../users/dto/reset-password.dto';
import { SentryInterceptor } from '../sentry/sentry.interceptor';
import { Request } from 'express';
import { UpdateUserConfirmationDto } from '../users/dto/update-user-confirmed-at.dto';
import { MessageResponse } from 'src/common/responses/messageResponse';
import { TokensDto } from 'src/common/dto/tokens.dto';
import { SignOutBodyDto } from './dto/signout-body.dtp';

@ApiTags('Auth')
@UseInterceptors(SentryInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign Up' })
  @ApiResponse({
    status: 200,
    description: 'Returns tokens',
    type: MessageResponse,
  })
  @Public()
  @Post('/signUp')
  signUp(
    @Req() req: Request,
    @Body() userDto: CreateUserDto,
  ): Promise<MessageResponse> {
    return this.authService.signUp(userDto, req.headers.origin);
  }

  @ApiOperation({ summary: 'Confirm' })
  @ApiResponse({
    status: 200,
    description: 'Returns message',
    type: MessageResponse,
  })
  @Public()
  @Patch('/confirmation')
  confirm(
    @Body() userUpdateDto: UpdateUserConfirmationDto,
  ): Promise<MessageResponse> {
    return this.authService.confirmEmail(userUpdateDto.token);
  }

  @ApiOperation({ summary: 'Sign In' })
  @ApiResponse({ status: 200, description: 'Returns tokens', type: TokensDto })
  @Public()
  @Post('/signIn')
  signIn(@Body() userDto: SignInUserDto): Promise<TokensDto> {
    return this.authService.signIn(userDto);
  }

  @ApiResponse({
    status: 200,
    type: MessageResponse,
  })
  @Post('/signOut')
  @ApiBearerAuth()
  signOut(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('accessToken') accessToken: string,
    @Body() body: SignOutBodyDto,
  ): Promise<MessageResponse> {
    return this.authService.signOut(userId, accessToken, body.refreshToken);
  }

  @Post('/fullSignOut')
  @ApiBearerAuth()
  fullSignOut(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('accessToken') accessToken: string,
  ) {
    return this.authService.fullSignOut(userId, accessToken);
  }

  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({
    status: 200,
    description: 'Returns success message',
    type: MessageResponse,
  })
  @ApiBearerAuth()
  @Post('/resetPassword')
  resetPassword(
    @GetCurrentUserId() userId: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<MessageResponse> {
    return this.authService.resetPassword(userId, resetPasswordDto);
  }

  @Public()
  @UseGuards(RefreshTokenAuthGuard)
  @ApiResponse({ status: 200, type: TokensDto })
  @ApiBearerAuth()
  @Post('/refresh')
  refreshAccessToken(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<TokensDto> {
    return this.authService.refreshAccessToken(userId, refreshToken);
  }
}
