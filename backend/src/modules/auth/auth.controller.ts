import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Tokens } from './types/tokens.type';
import { SignInUserDto } from '../users/dto/login-user.dto';
import { RefreshTokenAuthGuard } from './guards/refresh-token-auth.guard';
import { GetCurrentUserId } from './decorators/get-current-user-id.decorator';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import { Public } from './decorators/public.decorator';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign Up' })
  @ApiResponse({ status: 200, description: 'Returns tokens' })
  @Public()
  @Post('/signUp')
  signUp(@Body() userDto: CreateUserDto): Promise<Tokens> {
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
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('accessToken') accessToken: string,
  ) {
    return this.authService.signOut(userId, accessToken);
  }

  @Public()
  @UseGuards(RefreshTokenAuthGuard)
  @Post('/refresh')
  refreshAccessToken(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshAccessToken(userId, refreshToken);
  }
}
