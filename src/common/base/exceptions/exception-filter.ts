import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppHttpException } from './app-http.exception';

@Catch(AppHttpException)
export class AppHttpExceptionFilter implements ExceptionFilter {
  catch(exception: AppHttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      code: exceptionResponse['code'],
      message: exceptionResponse['message'],
      data: exceptionResponse['data'] || null,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }
}
