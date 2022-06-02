import { Module } from '@nestjs/common';
import { UsersModule } from 'src/modules/users/users.module';
import { DbModule } from '../db.module';
import { Seeder } from './seeder';

/**
 * Import and provide seeder classes.
 *
 * @module
 */
@Module({
  imports: [DbModule, UsersModule],
  providers: [Seeder],
})
export class SeederModule {}
