import { Column, Entity, OneToMany } from 'typeorm';
import { Role } from '../../roles/enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { RefreshTokenEntity } from '../../auth/models/refreshTokens.entity';
import { Exclude } from 'class-transformer';
import { ExpiredAccessTokenEntity } from '../../auth/models/expiredAccessTokens.entity';
import { BaseEntity } from '../../base.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @ApiProperty({ example: 'username', description: 'Unique username' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ example: 'email', description: 'Unique email' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'test1234', description: 'Password' })
  @Column({ nullable: false })
  @Exclude({ toPlainOnly: true })
  password: string;

  @ApiProperty({ example: 'cus_sfeIEff3fj', description: 'Stripe ID' })
  @Column({ nullable: true })
  customerStripeId: string;

  @ApiProperty({
    example: 'sub_s44eIEff3fj',
    description: 'Stripe Subscription ID',
  })
  @Column({ nullable: true })
  subscriptionId: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  roles: Role[];

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  confirmationToken: string;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  confirmedAt: Date;

  @OneToMany(() => RefreshTokenEntity, (refreshToken) => refreshToken.user, {
    onDelete: 'CASCADE',
  })
  @Exclude()
  refreshTokens: RefreshTokenEntity[];

  @OneToMany(
    () => ExpiredAccessTokenEntity,
    (expiredAccessToken) => expiredAccessToken.user,
    { onDelete: 'CASCADE' },
  )
  @Exclude()
  expiredAccessTokens: ExpiredAccessTokenEntity[];
}
