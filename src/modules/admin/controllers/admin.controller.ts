import { Controller, UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from '../../../common/interceptors/sentry.interceptor';

@UseInterceptors(SentryInterceptor)
@Controller('admin')
export class AdminController {}
