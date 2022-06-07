import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { RoleEntity } from '../../roles/models/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { RefreshTokenEntity } from '../../auth/models/refreshTokens.entity';
import { Exclude } from 'class-transformer';
import { ExpiredAccessTokenEntity } from '../../auth/models/expiredAccessTokens.entity';

@Entity('users')
export class UserEntity {
  @ApiProperty({ example: '1', description: 'Unique ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'username', description: 'Unique username' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ example: 'test1234', description: 'Password' })
  @Column({ nullable: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable()
  roles: RoleEntity[];

  @OneToMany(() => RefreshTokenEntity, (refreshToken) => refreshToken.user)
  @Exclude()
  refreshTokens: RefreshTokenEntity[];

  @OneToMany(
    () => ExpiredAccessTokenEntity,
    (expiredAccessToken) => expiredAccessToken.user,
  )
  @Exclude()
  expiredAccessTokens: ExpiredAccessTokenEntity[];
}
