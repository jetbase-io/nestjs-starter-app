import { ApiProperty } from '@nestjs/swagger';
import { Tokens } from 'src/common/types/tokens.type';

export class TokensDto implements Tokens {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  static invoke(accessToken: string, refreshToken: string): TokensDto {
    const dto = new TokensDto();

    dto.accessToken = accessToken;
    dto.refreshToken = refreshToken;

    return dto;
  }
}
