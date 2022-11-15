import { Module } from '@nestjs/common';
import { EmailService } from './emails.service';

@Module({
  imports: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
