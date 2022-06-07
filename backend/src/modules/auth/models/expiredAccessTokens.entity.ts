import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/models/users.entity';

@Entity('expired_access_tokens')
export class ExpiredAccessTokenEntity {
  @ApiProperty({ example: '1', description: 'Unique ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'token23#$!34', description: 'Unique token' })
  @Column({ unique: true })
  token: string;

  @ManyToOne(() => UserEntity, (user) => user.expiredAccessTokens)
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
