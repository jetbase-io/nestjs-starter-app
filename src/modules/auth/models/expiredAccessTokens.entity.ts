import { Column, Entity, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/models/users.entity';
import { BaseEntity } from '../../base.entity';

@Entity('expired_access_tokens')
export class ExpiredAccessTokenEntity extends BaseEntity {
  @ApiProperty({ example: 'token23#$!34', description: 'Unique token' })
  @Column({ unique: true })
  token: string;

  @ManyToOne(() => UserEntity, (user) => user.expiredAccessTokens, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
