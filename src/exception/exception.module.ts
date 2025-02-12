import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ThrottlerFilter } from './throttle/throttler.filter';
import { CatchEverythingFilter } from './catch-everything/catch-everything.filter';
import { AxiosExceptionFilter } from './axios-error/axios-error.filter';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: ThrottlerFilter,
    },
    // Disabled this cause it was giving issues loading graphql
    // {
    //   provide: APP_FILTER,
    //   useClass: CatchEverythingFilter,
    // },
    {
      provide: APP_FILTER,
      useClass: AxiosExceptionFilter,
    },
  ],
})
export class ExceptionModule {}
