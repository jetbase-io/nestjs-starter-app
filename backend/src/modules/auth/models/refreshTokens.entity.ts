import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/models/users.entity';
import { BaseEntity } from '../../base.entity';

@Entity('refresh_tokens')
export class RefreshTokenEntity extends BaseEntity {
  @ApiProperty({ example: 'token23#$!34', description: 'Unique token' })
  @Column({ unique: true })
  token: string;

  @ManyToOne(() => UserEntity, (user) => user.refreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
