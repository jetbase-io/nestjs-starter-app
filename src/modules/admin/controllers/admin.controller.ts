import { Controller, UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from '../../../modules/sentry/sentry.interceptor';

@UseInterceptors(SentryInterceptor)
@Controller('admin')
export class AdminController {}
