import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request: Request = ctx.getRequest();
    const response = ctx.getResponse<Response>(); // Get the response object

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: request
        ? (httpAdapter.getRequestUrl(request) as string)
        : 'Unknown Path',
      message:
        exception instanceof HttpException
          ? exception.message
          : exception instanceof Error
            ? exception.message
            : 'Internal Server Error',
    };

    // Use httpAdapter.reply for consistent response handling
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
