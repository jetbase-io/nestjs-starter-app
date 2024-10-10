import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsernameUnique } from '../users/validator/user-unique.validator';
import { entities } from './db.provider';
import { getConnectionOptions } from 'typeorm';
import { BaseToken } from 'src/common/enums/diTokens';
import { DbContext } from './DbContext';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), { autoLoadEntities: true }),
    }),
    TypeOrmModule.forFeature(entities),
  ],
  providers: [
    UsernameUnique,
    {
      provide: BaseToken.DB_CONTEXT,
      useClass: DbContext,
    },
  ],
  exports: [
    {
      provide: BaseToken.DB_CONTEXT,
      useClass: DbContext,
    },
  ],
})
export class DbModule {}
