import { Module } from '@nestjs/common';
import { UsersModule } from 'src/modules/users/users.module';
import { DbModule } from '../db.module';
import { Seeder } from './seeder';
import { StripeModule } from 'src/modules/stripe/stripe.module';

/**
 * Import and provide seeder classes.
 *
 * @module
 */
@Module({
  imports: [DbModule, UsersModule, StripeModule],
  providers: [Seeder],
})
export class SeederModule {}
