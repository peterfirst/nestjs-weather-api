import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { WeatherApiService } from './weather-api.service';

@Module({
  imports: [HttpModule],
  providers: [WeatherService, WeatherApiService],
  controllers: [WeatherController],
  exports: [WeatherService, WeatherApiService],
})
export class WeatherModule {}
