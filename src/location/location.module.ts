import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './location.entity';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { UserModule } from '../user/user.module';
import { WeatherModule } from '../weather/weather.module';
import { HttpModule } from '@nestjs/axios';
import { LocationUpdateTaskService } from './location-update-task.service';
import { LocationRepository } from './location.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location]),
    UserModule,
    WeatherModule,
    HttpModule,
  ],
  controllers: [LocationController],
  providers: [LocationService, LocationRepository, LocationUpdateTaskService],
  exports: [LocationService, LocationUpdateTaskService],
})
export class LocationModule {}
