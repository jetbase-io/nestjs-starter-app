import { ApiProperty } from '@nestjs/swagger';
import { Tokens } from 'src/modules/auth/types/tokens.type';

export class TokensDto implements Tokens {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  static call(accessToken: string, refreshToken: string): TokensDto {
    const dto = new TokensDto();

    dto.accessToken = accessToken;
    dto.refreshToken = refreshToken;

    return dto;
  }
}
