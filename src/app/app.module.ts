import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from 'nestjs-pino';
import { ThrottlerModule } from './module/throttle.module';
import { TypeOrmModule } from './module/typeOrmModule.module';
import { CacheModule } from './module/cache.module';
import { ExceptionModule } from '../exception/exception.module';
import { AuthModule } from '../auth/auth.module';
import { GraphqlModule } from './module/graphql.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { WeatherModule } from '../weather/weather.module';
import { UserModule } from '../user/user.module';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot(),
    ThrottlerModule,
    TypeOrmModule,
    CacheModule,
    GraphqlModule,
    ExceptionModule,
    HttpModule,
    WeatherModule,
    UserModule,
    LocationModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
