import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsernameUnique } from '../users/validator/user-unique.validator';
import { entities } from './db.provider';
import { getConnectionOptions } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), { autoLoadEntities: true }),
    }),
    TypeOrmModule.forFeature(entities),
  ],
  providers: [UsernameUnique],
})
export class DbModule {}
