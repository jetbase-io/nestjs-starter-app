import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/models/users.entity';

@Entity('refresh_tokens')
export class RefreshTokenEntity {
  @ApiProperty({ example: '1', description: 'Unique ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'token23#$!34', description: 'Unique token' })
  @Column({ unique: true })
  token: string;

  @ManyToOne(() => UserEntity, (user) => user.refreshTokens)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
