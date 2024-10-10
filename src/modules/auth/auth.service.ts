import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserEntity } from '../users/models/users.entity';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenEntity } from './models/refreshTokens.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpiredAccessTokenEntity } from './models/expiredAccessTokens.entity';
import { ResetPasswordDto } from '../users/dto/reset-password.dto';
import { SignInUserDto } from '../users/dto/login-user.dto';
import { EmailService } from '../emails/emails.service';
import { v4 as uuidv4 } from 'uuid';
import { getSecrets } from '../../utils/helpers/getSecrets';
import { TokensDto } from '../../common/dto/tokens.dto';
import { UserEntityDto } from '../users/dto/user.dto';
import { UsersRepository } from '../users/users.repository';
import { MessageResponse } from 'src/common/responses/messageResponse';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    @InjectRepository(ExpiredAccessTokenEntity)
    private readonly expiredAccessTokenRepository: Repository<ExpiredAccessTokenEntity>,
    private readonly emailService: EmailService,
    private readonly userRepository: UsersRepository,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(userDto: SignInUserDto): Promise<TokensDto> {
    const user = await this.validateUser(userDto.username, userDto.password);
    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user, tokens.refreshToken);
    return tokens;
  }

  async sendEmail(to: string): Promise<void> {
    const emailContent = 'This is a welcome message! Thank You for signing up!';
    const emailDescription = 'Welcome message';
    await this.emailService.sendGeneralEmail(
      to,
      emailContent,
      emailDescription,
    );
  }

  async sendConfirmationEmail(
    to: string,
    url: string,
    confirmationToken: string,
  ): Promise<void> {
    const CONFIRM_URL = `${url}/confirmation/?confirmation_token=${confirmationToken}`;
    await this.emailService.sendConfirmationLink(to, CONFIRM_URL);
  }

  async signUp(
    createUserDto: CreateUserDto,
    url: string,
  ): Promise<MessageResponse> {
    await this.usersService.validateUsername(createUserDto.username);
    createUserDto.confirmationToken = uuidv4();
    await this.usersService.create({ ...createUserDto });
    await this.sendConfirmationEmail(
      createUserDto.email,
      url,
      createUserDto.confirmationToken,
    );
    const message = 'Successfully signed up! We sent confirmation email';
    return MessageResponse.invoke(message);
  }

  async confirmEmail(confirmationToken: string): Promise<MessageResponse> {
    const user = await this.usersService.findByConfirmationToken(
      confirmationToken,
    );
    if (!user)
      throw new HttpException(
        'Invalid confirmation token',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    user.confirmedAt = new Date(Date.now());
    await this.userRepository.save(user);

    const message =
      'Your email address has been successfully confirmed! Now you can sign in!';
    return MessageResponse.invoke(message);
  }

  async signOut(
    userId: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<MessageResponse> {
    await this.deleteRefreshToken(userId, refreshToken);
    await this.saveExpiredAccessToken(userId, accessToken);
    const message = 'Successfully logged out!';
    return MessageResponse.invoke(message);
  }

  async resetPassword(
    userId: string,
    resetPassword: ResetPasswordDto,
  ): Promise<MessageResponse> {
    const user = await this.usersService.getOne(userId);
    const isMatch = await this.usersService.isPasswordValid(
      resetPassword.oldPassword,
      user,
    );

    if (!isMatch) {
      throw new BadRequestException({
        message: 'Old password does not match!',
      });
    }

    if (resetPassword.newPassword !== resetPassword.confirmPassword) {
      throw new BadRequestException({
        message: 'Old and Confirm do not match!',
      });
    }

    await this.usersService.updatePassword(userId, resetPassword.newPassword);
    await this.deleteAllRefreshTokens(userId);

    const message = 'Password updated successfully!';
    return MessageResponse.invoke(message);
  }

  async fullSignOut(userId: string, accessToken: string): Promise<void> {
    await this.deleteAllRefreshTokens(userId);
    await this.saveExpiredAccessToken(userId, accessToken);
  }

  async refreshAccessToken(
    userId: string,
    refreshToken: string,
  ): Promise<TokensDto> {
    await this.deleteRefreshToken(userId, refreshToken);
    const user = await this.userRepository.getOneById(userId);
    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user, tokens.refreshToken);

    return tokens;
  }

  async validateUser(username: string, password: string) {
    const user = await this.userRepository.getOneByName(username);
    const message = 'Incorrect password or username';

    if (!user?.confirmedAt) {
      throw new ForbiddenException({ message });
    }
    const isPasswordsEqual = await this.usersService.isPasswordValid(
      password,
      user,
    );
    if (!isPasswordsEqual) {
      throw new ForbiddenException({ message });
    }
    return user;
  }

  async updateRefreshToken(
    user: UserEntity,
    refreshToken: string,
  ): Promise<void> {
    // create new refresh token
    const refreshTokenDb = new RefreshTokenEntity();
    refreshTokenDb.token = refreshToken;
    refreshTokenDb.user = user;
    await this.refreshTokenRepository.save(refreshTokenDb);
  }

  async deleteRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const foundToken = await this.refreshTokenRepository.findOne({
      where: { user: { id: userId }, token: refreshToken },
    });
    // delete old refresh token
    if (foundToken) {
      await this.refreshTokenRepository.remove(foundToken);
    } else {
      throw new ForbiddenException('Access denied!');
    }
  }

  async deleteAllRefreshTokens(userId: string): Promise<void> {
    const foundTokens = await this.refreshTokenRepository.find({
      where: { user: { id: userId } },
    });
    await this.refreshTokenRepository.remove(foundTokens);
  }

  async saveExpiredAccessToken(
    userId: string,
    accessToken: string,
  ): Promise<void> {
    const user = await this.userRepository.getOneById(userId);
    const createdExpiredToken = new ExpiredAccessTokenEntity();
    createdExpiredToken.user = user;
    createdExpiredToken.token = accessToken;
    await this.expiredAccessTokenRepository.save(createdExpiredToken);
  }

  async isAccessTokenExpired(userId: string, token: string): Promise<boolean> {
    const foundToken = await this.expiredAccessTokenRepository.findOne({
      where: { user: { id: userId }, token: token },
    });
    return foundToken !== undefined;
  }

  private async generateTokens(user: UserEntityDto): Promise<TokensDto> {
    const payload = {
      id: user.id,
      username: user.username,
      password: user.password,
      roles: user.roles,
    };

    const { secretForAccessToken, secretForRefreshToken } = getSecrets(
      user.roles,
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: secretForAccessToken,
        expiresIn: process.env.ACCESS_TOKEN_LIFESPAN,
      }),
      this.jwtService.signAsync(payload, {
        secret: secretForRefreshToken,
        expiresIn: process.env.REFRESH_TOKEN_LIFESPAN,
      }),
    ]);

    return TokensDto.invoke(accessToken, refreshToken);
  }
}
